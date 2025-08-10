from core.model.model import generate_llm
from core.model.llm_schemas import DeepAnalysis


def normalize_list_fields(result: dict) -> dict:
    for field in [
        "differential_diagnoses",
        "red_flags",
        "missed_questions",
        "contextual_factors",
    ]:
        if isinstance(result.get(field), str):
            result[field] = [result[field]]
        elif result.get(field) is None:
            result[field] = []
    return result


def generate_deep_analysis(transcript: str) -> dict:
    """
    Generates a DeepAnalysis JSON from a doctor-patient conversation transcript.
    Returns a structured analysis or error fallback.
    """
    prompt = """
You are a medical AI analyst. Perform a deep analysis of this doctor-patient conversation.

Conversation:
{transcript}

IMPORTANT:
- Provide a single sentence or paragraph for each field in the DeepAnalysis schema.
- Do not return arrays or lists; if multiple items, separate them with commas in a single string.
"""

    try:
        # Generate LLM response (assuming generate_llm returns a DeepAnalysis object)
        response = generate_llm(DeepAnalysis).invoke(
            prompt.format(transcript=transcript)
        )

        # Convert Pydantic model to dict (includes all DeepAnalysis fields)
        result = response.model_dump()
        return result

    except Exception as e:
        # Fallback with detailed error info
        return {
            "error": "Failed to generate deep analysis",
            "details": str(e),
            "fallback_fields": {
                "patient_complaints": "Unable to parse",
                "clinical_findings": "",
                "primary_diagnosis": "",
                "differential_diagnoses": [],
                "red_flags": [],
            },
            "raw_response": str(response) if "response" in locals() else None,
        }
