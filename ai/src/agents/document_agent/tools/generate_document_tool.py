from core.model.model import generate_llm
from pydantic import BaseModel
from typing import Type


def generate_custom_document(
    transcript: str,
    custom_model: Type[BaseModel],
    document_type: str,
    doctor_suggestions: str = None,
):
    """
    Generate a medical note based on custom model fields, document type,
    and doctor suggestions (compulsory if provided).
    """
    # Get field information from the model class
    fields_info = [
        {"label": name, "description": field.description}
        for name, field in custom_model.__fields__.items()
    ]

    # Build the note sections
    prompt_sections = [
        f"{field['label'].upper()}: {field['description']}" for field in fields_info
    ]

    # Start prompt with doctor's suggestions (highest priority)
    prompt_template = ""

    if doctor_suggestions and doctor_suggestions.strip():
        prompt_template += (
            f"DOCTOR'S SUGGESTIONS (MANDATORY):\n{doctor_suggestions}\n\n"
            f"⚠️ RULE: You MUST strictly follow and apply these suggestions. "
            f"They override any conflicting information in the transcript. "
            f"Do not ignore, alter, or omit them. "
            f"If something in the transcript contradicts the suggestions, IGNORE it.\n\n"
        )
    else:
        prompt_template += (
            f"⚠️ RULE: No doctor suggestions provided. Only rely on the transcript "
            f"and required sections. Do not add or invent information.\n\n"
        )

    # Continue with the actual task
    prompt_template += (
        f"You are a professional medical scribe. Convert the following "
        f"doctor-patient conversation into a {document_type} note with EXACTLY "
        f"these {len(fields_info)} sections:\n\n"
        + "\n".join(prompt_sections)
        + f"\n\nCONVERSATION:\n{transcript}\n\n"
        f"✅ Before finalizing, double-check that the note follows ALL rules "
        f"and especially the doctor's suggestions above."
    )

    try:
        print("Generated Prompt:", prompt_template)
        response = generate_llm(custom_model).invoke(prompt_template)
        return response

    except Exception as e:
        print(f"[ERROR] Failed to generate {document_type} note: {str(e)}")
        return {
            "error": f"Failed to generate {document_type} note",
            "exception": str(e),
            "raw_response": str(response) if "response" in locals() else None,
        }
