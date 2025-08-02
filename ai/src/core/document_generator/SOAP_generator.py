from core.model.model import llm
import json


def generate_SOAP(transcript):
    prompt = """
    [INST] <<SYS>>
    You are a medical scribe. Convert this doctor-patient conversation into a SOAP note in JSON format.
    The JSON should have these keys: "subjective", "objective", "assessment", "plan".
    Return ONLY the JSON object, nothing else.
    <</SYS>>

    **Conversation:**
    {transcript}

    **Structured Output:**
    {{
        "subjective": "patient's complaints here",
        "objective": "doctor's findings here",
        "assessment": "diagnosis here",
        "plan": "next steps here"
    }}[/INST]
    """

    response = llm.invoke(prompt.format(transcript=transcript))

    try:
        # Try to parse the response as JSON
        soap_json = json.loads(response)
        return soap_json
    except json.JSONDecodeError:
        # If parsing fails, return a default structure with the raw response
        return {
            "subjective": "Unable to parse response",
            "objective": "",
            "assessment": "",
            "plan": "",
            "raw_response": response,
        }
