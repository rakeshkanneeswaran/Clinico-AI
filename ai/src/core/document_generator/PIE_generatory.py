from core.model.model import llm
import json


def generate_PIE(transcript):
    prompt = """
    [INST] <<SYS>>
    You are a medical scribe. Convert this doctor-patient conversation into a PIE note in JSON format.
    The JSON should have these keys: "Problem", "Intervention", "Intervention".
    Return ONLY the JSON object, nothing else.
    <</SYS>>

    **Conversation:**
    {transcript}

    **Structured Output:**
    {{
        "problem": "patient's complaints here",
        "intervention": "doctor's actions here",
        "evaluation": "outcome here"
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
            "problem": "Unable to parse response",
            "intervention": "",
            "evaluation": "",
            "raw_response": response,
        }
