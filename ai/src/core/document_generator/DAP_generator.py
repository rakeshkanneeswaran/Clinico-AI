from core.model.model import llm
import json


def generate_DAP(transcript):
    prompt = """
    [INST] <<SYS>>
    You are a medical scribe. Convert this doctor-patient conversation into a DAP note in JSON format.
    The JSON should have these keys: "data", "assessment", "plan".
    Return ONLY the JSON object, nothing else.
    <</SYS>>

    **Conversation:**
    {transcript}

    **Structured Output:**
    {{
        "data": "patient's complaints here",
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
            "data": "",
            "assessment": "",
            "plan": "",
            "raw_response": response,
        }
