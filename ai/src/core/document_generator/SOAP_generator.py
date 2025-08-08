from core.model.model import generate_llm
from core.model.llm_schemas import SOAP


def generate_SOAP(transcript):
    prompt = """
    You are a medical scribe. Convert this doctor-patient conversation into a SOAP note.

    **Conversation:**
    {transcript}
    """

    try:
        response = generate_llm(SOAP).invoke(prompt.format(transcript=transcript))
        transcript_str = (
            f"Subjective: {response.subjective}\n"
            f"Objective: {response.objective}\n"
            f"Assessment: {response.assessment}\n"
            f"Plan: {response.plan}"
        )

        return {
            "subjective": response.subjective,
            "objective": response.objective,
            "assessment": response.assessment,
            "plan": response.plan,
            "transcript": transcript_str,
        }
    except Exception:
        return {
            "subjective": "Unable to parse response",
            "objective": "",
            "assessment": "",
            "plan": "",
            "transcript": "",
            "raw_response": str(response) if "response" in locals() else None,
        }
