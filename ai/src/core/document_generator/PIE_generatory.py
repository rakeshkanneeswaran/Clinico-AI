from core.model.model import generate_llm
from core.model.llm_schemas import PIE


def generate_PIE(transcript):
    prompt = """
    You are a medical scribe. Convert this doctor-patient conversation into a PIE note.

    **Conversation:**
    {transcript}
    """

    try:
        response = generate_llm(PIE).invoke(prompt.format(transcript=transcript))
        return {
            "problem": response.problem,
            "intervention": response.intervention,
            "evaluation": response.evaluation,
        }
    except Exception:
        return {
            "problem": "Unable to parse response",
            "intervention": "",
            "evaluation": "",
            "raw_response": str(response) if "response" in locals() else None,
        }
