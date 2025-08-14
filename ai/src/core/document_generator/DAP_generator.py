from core.model.model import generate_llm
from core.model.llm_schemas import DAP


def generate_DAP(transcript):
    prompt = """
You are a medical scribe. Convert this doctor-patient conversation into a DAP note with EXACTLY these 3 sections:

1. DATA: Relevant clinical facts, observations, and patient-reported information
2. ASSESSMENT: Professional interpretation of the data including diagnosis/differential
3. PLAN: Concrete next steps including treatment, referrals, and follow-up


CONVERSATION:
{transcript}
"""
    response = generate_llm(DAP).invoke(prompt.format(transcript=transcript))
    try:
        dap_json = {
            "data": response.data,
            "assessment": response.assessment,
            "plan": response.plan,
        }
        return dap_json
    except Exception:
        return {
            "data": "Unable to parse response",
            "assessment": "",
            "plan": "",
            "raw_response": str(response),
        }
