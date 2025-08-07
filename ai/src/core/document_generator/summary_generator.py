from core.model.model import llm
import json


def generate_summary(transcript):
    prompt = """
    [INST] <<SYS>>
    You are a medical scribe. Convert this doctor-patient conversation into a Summary note in JSON format.
    The JSON should have these keys: "patient_info", "reason_for_visit", "clinical_findings".
    Return ONLY the JSON object, nothing else.
    <</SYS>>

    **Conversation:**
    {transcript}

    **Structured Output:**
    {{
        "patient_info": "patient's information here",
        "reason_for_visit": "reason for visit here",
        "clinical_findings": "clinical findings here"
    }}[/INST]
    """

    response = llm.invoke(prompt.format(transcript=transcript))

    try:
        parsed = json.loads(response)

        if (
            isinstance(parsed, dict)
            and set(parsed.keys())
            == {"patient_info", "reason_for_visit", "clinical_findings"}
            and all(
                isinstance(parsed[k], str)
                for k in ["patient_info", "reason_for_visit", "clinical_findings"]
            )
        ):
            return parsed
        else:
            return {
                "error": "Invalid structure in response",
                "patient_info": "",
                "reason_for_visit": "",
                "clinical_findings": "",
                "raw_response": response,
            }

    except json.JSONDecodeError:
        return {
            "error": "Unable to parse response",
            "patient_info": "",
            "reason_for_visit": "",
            "clinical_findings": "",
            "raw_response": response,
        }
