from core.model.model import llm
import json


def generate_referral(transcript):
    prompt = """
    [INST] <<SYS>>
    You are a medical scribe. Convert this doctor-patient conversation into a Referral note in JSON format.
    The JSON should have these keys: "patient_info", "reason_for_referral", "referring_provider".
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
        parsed = json.loads(response)

        if (
            isinstance(parsed, dict)
            and set(parsed.keys())
            == {"patient_info", "reason_for_referral", "referring_provider"}
            and isinstance(parsed["patient_info"], (str, dict))
            and isinstance(parsed["reason_for_referral"], str)
            and isinstance(parsed["referring_provider"], (str, dict))
        ):
            return parsed
        else:
            return {
                "error": "Invalid structure in response",
                "patient_info": "",
                "reason_for_referral": "",
                "referring_provider": "",
                "raw_response": response,
            }

    except json.JSONDecodeError:
        return {
            "error": "Unable to parse response",
            "patient_info": "",
            "reason_for_referral": "",
            "referring_provider": "",
            "raw_response": response,
        }
