from core.model.model import generate_llm
from core.model.llm_schemas import Summary


def generate_summary(transcript):
    prompt = """
    You are a medical scribe. Convert this doctor-patient conversation into a Summary note.

    **Conversation:**
    {transcript}
    """

    try:
        response = generate_llm(Summary).invoke(prompt.format(transcript=transcript))
        return {"summary": response.summary}
    except Exception:
        return {
            "summary": "Unable to parse response",
            "raw_response": str(response) if "response" in locals() else None,
        }
