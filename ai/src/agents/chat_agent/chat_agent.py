from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END, add_messages
from langchain_core.messages import HumanMessage, ToolMessage, SystemMessage, AIMessage
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import json

# Import the agents
from agents.chat_agent.tools.rag_tool import get_relevant_contexts
from langsmith import traceable


# -------------------------------
#  Environment & Model Setup
# -------------------------------
load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

# Bind tools to the LLM
tools = [get_relevant_contexts]
llm_with_tools = llm.bind_tools(tools=tools)


# -------------------------------
#  System Role Message
# -------------------------------
system_message = SystemMessage(
    content="""
You are a medical assistant. Provide clear, grammatically correct answers based only on available information.

Guidelines:
- Answer directly and precisely to what is asked
- Use complete, well-formed sentences
- Maintain proper grammar and medical terminology
- Avoid unnecessary commentary
- If information is available, state it clearly
- If information is incomplete, state only what is known without assumptions
"""
)

query_validator_message = SystemMessage(
    content="""
You are a query validator.

Your task is to check whether the user's query is appropriate for processing by a medical assistant.

Validation Rules:
- Reply ONLY with "YES" or "NO".
- Reply "YES" if the query is medically relevant, respectful, and safe to process.
- Reply "NO" if the query contains any of the following:
  • Sexual or explicit content  
  • Offensive, abusive, or violent language  
  • Irrelevant or non-medical topics  
  • Requests unrelated to health, medicine, or patient care

No explanations. Only output "YES" or "NO".
"""
)


# -------------------------------
# State Definition
# -------------------------------
class State(TypedDict):
    messages: Annotated[list, add_messages]
    context: list[str]
    session_id: str


# -------------------------------
# Query Validator Node
# -------------------------------
@traceable
def query_validator(state: State):
    """Validates the user query to ensure it's appropriate for processing."""
    response = llm.invoke([query_validator_message] + state["messages"])
    return {"messages": [response]}


# -------------------------------
# Query Validator Router Node
# -------------------------------
@traceable
def query_validator_router(state: State):
    """Routes to chatbot if query is valid, otherwise ends."""
    last_message = state["messages"][-1]
    if last_message.content.strip().upper() == "NO":
        return END
    return "chatbot"


# -------------------------------
#  Chatbot Node
# -------------------------------
@traceable
def chatbot(state: State):
    """Primary chatbot node that invokes the LLM with tools."""
    # remove the last message (the NO/YES message)
    state["messages"] = state["messages"][:-1]
    ai_message = llm_with_tools.invoke([system_message] + state["messages"])
    return {"messages": [ai_message]}


# -------------------------------
#  Tools Router Node
# -------------------------------
@traceable
def tools_router(state: State):
    """
    Route logic:
    - If context exists → go to answer_using_context_node
    - If LLM requests a tool → go to tool_node
    - Otherwise → end
    """
    last_message = state["messages"][-1]

    # Skip tool call if context already present
    if state.get("context") and len(state["context"]) > 0:
        return "answer_using_context_node"

    # Route to tool if LLM triggered one
    if hasattr(last_message, "tool_calls") and len(last_message.tool_calls) > 0:
        return "tool_node"

    # End if no action needed
    return END


# -------------------------------
#  Tool Node (Handles RAG Tool)
# -------------------------------
@traceable
def tool_node_fn(state: State):
    """Handles the execution of the get_relevant_contexts tool."""

    # Avoid duplicate tool calls if context already loaded
    if state.get("context") and len(state["context"]) > 0:
        print("⚠️ Context already exists. Skipping tool call.")
        return {"messages": []}

    last_message = state["messages"][-1]
    tool_call = last_message.tool_calls[0]

    # Execute the RAG tool if requested
    if tool_call["name"] == "get_relevant_contexts":
        query = tool_call["args"]["query"]

        # Proper invocation
        result = get_relevant_contexts.invoke(
            {"query": query, "session_id": state["session_id"]}
        )

        # Cache retrieved context
        state["context"] = result

        # Return the tool message to continue the conversation
        tool_message = ToolMessage(
            content=json.dumps(result, indent=2),
            name="get_relevant_contexts",
            tool_call_id=tool_call["id"],  # critical for preventing recursion
        )
        return {"messages": [tool_message], "context": result}

    return {"messages": []}


# -------------------------------
#  Answer Using Context Node
# -------------------------------
@traceable
def answer_using_context_node(state: State):
    """Generates the final answer using the retrieved context by the tools"""
    print("current state:", state)
    state["messages"].append(
        SystemMessage(content=f"Relevant patient context:\n{state['context']}")
    )
    answer = llm.invoke(state["messages"])
    return {"messages": [answer]}


# -------------------------------
#  Graph Definition
# -------------------------------
graph = StateGraph(State)

# Add nodes
graph.add_node("query_validator", query_validator)
graph.add_node("chatbot", chatbot)
graph.add_node("tool_node", tool_node_fn)
graph.add_node("answer_using_context_node", answer_using_context_node)

# Define graph flow
graph.set_entry_point("query_validator")
graph.add_conditional_edges("query_validator", query_validator_router)
graph.add_conditional_edges("chatbot", tools_router)
graph.add_edge("tool_node", "answer_using_context_node")
graph.add_edge("answer_using_context_node", END)

# Compile the chat agent
chat_app = graph.compile()


# -------------------------------
#  Public Interface Function
# -------------------------------
@traceable
def invoke_chat_agent(query: str, session_id: str):
    """
    Invokes the full chat agent pipeline:
    1. Adds the system and user messages
    2. Passes session info
    3. Uses cached or retrieved context
    4. Returns the final LLM answer
    """
    response = chat_app.invoke(
        {
            "messages": [
                HumanMessage(content=query),
            ],
            "session_id": session_id,
            "context": [],
        },
    )

    # Return only the final message content
    return (
        "I'm sorry, I cannot assist with that request because it is inappropriate or violates the platform guidelines."
        if response["messages"][-1].content == "NO"
        else response["messages"][-1].content
    )
