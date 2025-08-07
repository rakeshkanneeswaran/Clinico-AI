from core.model.model import llm
import json


def generate_PIE(transcript):
    prompt = """
    [INST] <<SYS>>
    You are a medical scribe. Convert this doctor-patient conversation into a PIE note in JSON format.
    The JSON should have these keys: "problem", "intervention", "evaluation".
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
        parsed = json.loads(response)

        if (
            isinstance(parsed, dict)
            and set(parsed.keys()) == {"problem", "intervention", "evaluation"}
            and all(
                isinstance(parsed[k], str)
                for k in ["problem", "intervention", "evaluation"]
            )
        ):
            return parsed
        else:
            return {
                "error": "Invalid structure in response",
                "problem": "",
                "intervention": "",
                "evaluation": "",
                "raw_response": response,
            }

    except json.JSONDecodeError:
        return {
            "error": "Unable to parse response",
            "problem": "",
            "intervention": "",
            "evaluation": "",
            "raw_response": response,
        }
