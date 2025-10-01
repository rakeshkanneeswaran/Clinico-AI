# core/tools/document_tools.py
from langchain_core.tools import tool
from core.model.model import generate_llm
from pydantic import BaseModel
from typing import Type


@tool("generate_custom_document")
def generate_custom_document_tool(
    transcript: str,
    custom_model: Type[BaseModel],
    document_type: str,
    doctor_suggestions: str = None,
):
    """
    Tool: Generate a structured medical note using the transcript,
    custom fields, and doctor's suggestions.
    """
    # Get field info from the model
    fields_info = [
        {"label": name, "description": field.description}
        for name, field in custom_model.__fields__.items()
    ]

    # Build prompt
    prompt_sections = [
        f"{field['label'].upper()}: {field['description']}" for field in fields_info
    ]

    prompt_template = ""

    if doctor_suggestions and doctor_suggestions.strip():
        prompt_template += (
            f"DOCTOR'S SUGGESTIONS (MANDATORY):\n{doctor_suggestions}\n\n"
            f"⚠️ RULE: You MUST strictly follow and apply these suggestions. "
            f"They override any conflicting information in the transcript. "
            f"Do not ignore, alter, or omit them.\n\n"
        )
    else:
        prompt_template += (
            "⚠️ RULE: No doctor suggestions provided. Only rely on the transcript "
            "and required sections. Do not add or invent information.\n\n"
        )

    prompt_template += (
        f"You are a professional medical scribe. Convert the following "
        f"doctor-patient conversation into a {document_type} note with EXACTLY "
        f"these {len(fields_info)} sections:\n\n"
        + "\n".join(prompt_sections)
        + f"\n\nCONVERSATION:\n{transcript}\n\n"
        f"✅ Ensure the note follows all rules and doctor's suggestions."
    )

    try:
        response = generate_llm(custom_model).invoke(prompt_template)
        return response
    except Exception as e:
        return {"error": str(e)}
