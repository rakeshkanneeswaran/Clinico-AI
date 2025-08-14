from core.model.model import generate_llm
from core.model.llm_schemas import SOAP


def generate_SOAP(transcript):
    prompt = """
You are a medical scribe. Convert this doctor-patient conversation into a SOAP note with EXACTLY these 4 sections:

1. SUBJECTIVE: Patient's complaints in their own words and relevant history
2. OBJECTIVE: Measurable findings from examination and tests
3. ASSESSMENT: Professional diagnosis or differential
4. PLAN: Specific treatment steps and follow-up instructions


CONVERSATION:
{transcript}
"""

    try:
        print("Transcript:", transcript)
        response = generate_llm(SOAP).invoke(prompt.format(transcript=transcript))
        return {
            "subjective": response.subjective,
            "objective": response.objective,
            "assessment": response.assessment,
            "plan": response.plan,
        }

    except Exception as e:
        print(f"[ERROR] Failed to generate SOAP note: {str(e)}")
        return {
            "subjective": "Unable to parse response",
            "objective": "",
            "assessment": "",
            "plan": "",
            "transcript": "",
            "raw_response": str(response) if "response" in locals() else None,
        }
