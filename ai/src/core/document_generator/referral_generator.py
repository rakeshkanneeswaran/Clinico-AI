from core.model.model import llm
import json


def generate_referral(transcript):
    prompt = """
    [INST] <<SYS>>
    You are a medical scribe. Convert this doctor-patient conversation into a Referral note in JSON format.
    The JSON should have these keys: "patient_info", "reason_for_referral", "referring_provider ".
    Return ONLY the JSON object, nothing else.
    <</SYS>>

    **Conversation:**
    {transcript}

    **Structured Output:**
    {{
        "patient_info": "patient's information here",
        "reason_for_referral": "reason for referral here",
        "referring_provider": "referring provider's information here"
    }}[/INST]
    """

    response = llm.invoke(prompt.format(transcript=transcript))

    try:
        # Try to parse the response as JSON
        referral_json = json.loads(response)
        return referral_json
    except json.JSONDecodeError:
        # If parsing fails, return a default structure with the raw response
        return {
            "subjective": "Unable to parse response",
            "patient_info": "",
            "reason_for_referral": "",
            "referring_provider": "",
            "raw_response": response,
        }
