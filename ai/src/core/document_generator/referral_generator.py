from core.model.model import generate_llm
from core.model.llm_schemas import Referral


def generate_referral(transcript):
    prompt = """
    You are a medical scribe. Convert this doctor-patient conversation into a Referral note.

    **Conversation:**
    {transcript}
    """

    try:
        response = generate_llm(Referral).invoke(prompt.format(transcript=transcript))
        transcript_str = (
            f"Patient Info: {response.patient_info}\n"
            f"Reason for Referral: {response.reason_for_referral}"
        )

        return {
            "patient_info": response.patient_info,
            "reason_for_referral": response.reason_for_referral,
            "transcript": transcript_str,
        }
    except Exception:
        return {
            "patient_info": "Unable to parse response",
            "reason_for_referral": "",
            "transcript": "",
            "raw_response": str(response) if "response" in locals() else None,
        }
