from core.model.model import generate_llm
from pydantic import BaseModel
from typing import Type


def generate_custom_document(
    transcript: str, custom_model: Type[BaseModel], document_type: str
):
    """
    Generate a medical note based on custom model fields and document type.
    """
    # Get field information from the model class
    fields_info = [
        {"label": name, "description": field.description}
        for name, field in custom_model.__fields__.items()
    ]

    # Dynamically generate the prompt sections
    prompt_sections = []
    for field in fields_info:
        prompt_sections.append(f"{field['label'].upper()}: {field['description']}")

    prompt_template = (
        f"""You are a medical scribe. Convert this doctor-patient conversation into a {document_type} note with EXACTLY these {len(fields_info)} sections:\n\n"""
        + f"""\n\nCONVERSATION:\n{transcript}"""
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
