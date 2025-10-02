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
You are a clinical medical assistant AI supporting a doctor during patient consultation and documentation.

The user is a qualified medical professional (doctor). 
Communicate professionally and precisely using appropriate medical terminology. 
Avoid explaining basic medical concepts — assume the doctor understands them.

Your role:
- Assist the doctor in retrieving, summarizing, or reasoning about the patient's medical history, symptoms, or findings.
- Provide accurate, concise, and clinically useful information.
- Use the available tools to retrieve relevant patient data before answering.
- If the required information is missing, call the retrieval tool to gather it.

Guidelines:
- Always use the tool if you lack details about diagnosis, history, frequency, or other key data points.
- Do NOT make assumptions or generate fabricated information.
- Respond in a factual, structured, and grammatically correct manner suitable for a medical record or clinical discussion.
"""
)


query_validator_message = SystemMessage(
    content="""
You are a query validator for a medical assistant.

Your goal is to check if the user's query is appropriate to process in a healthcare or medical context.

Validation Rules:
- Reply ONLY with "YES" or "NO".
- Reply "YES" if the query is related to health, medicine, a patient, a diagnosis, symptoms, medical history, treatment, or clinical information — even if it is phrased simply (e.g., "What was the patient complaint?").
- Reply "NO" ONLY if the query:
  • Contains sexual, explicit, or adult content  
  • Includes offensive, disrespectful, or violent language  
  • Is completely unrelated to health, patients, or medicine (e.g., sports, politics, entertainment, etc.)

Remember: short or grammatically simple medical questions (like “Does the patient smoke?”, “What did the doctor say?”, “Patient complaint?”) are VALID and should be marked "YES".

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
