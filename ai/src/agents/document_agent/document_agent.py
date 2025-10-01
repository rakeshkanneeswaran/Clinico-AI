# agents/document_agent/document_agent.py

from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END, add_messages
from langchain_core.messages import SystemMessage, AIMessage
from langchain_groq import ChatGroq
from langsmith import traceable
from dotenv import load_dotenv
from agents.document_agent.tools.generate_document_tool import (
    generate_custom_document_tool,
)


# -------------------------------
# Environment & Model Setup
# -------------------------------
load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.2,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)


# -------------------------------
# State Definition
# -------------------------------
class State(TypedDict):
    messages: Annotated[list, add_messages]
    transcript: str
    custom_model: object
    document_type: str
    doctor_suggestions: str
    generated_document: object


# -------------------------------
# Document Generation Node
# -------------------------------
@traceable
def document_generator_node(state: State):
    """Generates a structured medical note from transcript and model."""
    print("🧾 Generating medical document...")

    result = generate_custom_document_tool.invoke(
        {
            "transcript": state["transcript"],
            "custom_model": state["custom_model"],
            "document_type": state["document_type"],
            "doctor_suggestions": state["doctor_suggestions"],
        }
    )

    state["generated_document"] = (
        result.content if hasattr(result, "content") else result
    )

    print("✅ Document generated successfully.")

    return {
        "messages": [AIMessage(content="Document generated successfully.")],
        "generated_document": state["generated_document"],
    }


# -------------------------------
# Quality Checker Node
# -------------------------------
@traceable
def document_quality_checker_node(state: State):
    """Evaluates and refines the generated medical note for professionalism and clarity."""
    print("🩺 Checking document phrasing and quality...")

    # ✅ Build the quality check prompt
    quality_prompt = SystemMessage(
        content=f"""
You are a professional medical documentation editor.

Review and refine the following medical note for clarity, professionalism, and accuracy.
Rephrase sentences in the style of clinical documentation.

Rules:
- Keep all medical facts intact.
- Use formal, clinical, and grammatically correct phrasing.
- Maintain brevity and precision.
- Avoid redundancy.
- DO NOT invent, omit, or modify medical meaning.

Here is the document to refine:
{state["generated_document"]}

Output must strictly follow the structure of the provided model.
"""
    )

    refined_output = llm.with_structured_output(state["custom_model"]).invoke(
        [quality_prompt]
    )

    print(refined_output)

    # ✅ Return — no message wrapping of model objects
    return {
        "messages": [AIMessage(content="Document refined successfully.")],
        "generated_document": refined_output,
    }


# -------------------------------
# Graph Definition
# -------------------------------
graph = StateGraph(State)

graph.add_node("document_generator", document_generator_node)
graph.add_node("document_quality_checker", document_quality_checker_node)

graph.set_entry_point("document_generator")
graph.add_edge("document_generator", "document_quality_checker")
graph.add_edge("document_quality_checker", END)

document_agent = graph.compile()


# -------------------------------
# Public Interface
# -------------------------------
@traceable
def invoke_document_agent(
    transcript: str,
    custom_model,
    document_type: str,
    doctor_suggestions: str = "",
):
    """
    Invokes the document generation pipeline:
    1. Generates a structured medical note.
    2. Refines it for phrasing and professionalism.
    3. Returns the final structured document (same as generate_custom_document()).
    """
    response = document_agent.invoke(
        {
            "messages": [],
            "transcript": transcript,
            "custom_model": custom_model,
            "document_type": document_type,
            "doctor_suggestions": doctor_suggestions,
            "generated_document": {},
        },
    )

    # ✅ Return the structured model directly (not a message)
    return response["generated_document"]
