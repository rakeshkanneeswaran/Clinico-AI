from core.model.model import generate_llm
from core.model.llm_schemas import DAP


def generate_DAP(transcript):
    prompt = """
    You are a medical scribe. Convert this doctor-patient conversation into a DAP note.

    **Conversation:**
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
