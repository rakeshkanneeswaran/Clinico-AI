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
        # Try to parse the response as JSON
        summary_json = json.loads(response)
        return summary_json
    except json.JSONDecodeError:
        # If parsing fails, return a default structure with the raw response
        return {
            "subjective": "Unable to parse response",
            "patient_info": "",
            "reason_for_visit": "",
            "clinical_findings": "",
            "raw_response": response,
        }
