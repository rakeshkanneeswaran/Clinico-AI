from core.model.model import generate_llm
from core.model.llm_schemas import PIE


def generate_PIE(transcript):
    prompt = """
You are a medical clinical scribe. Convert this doctor-patient conversation into a PIE note with EXACTLY these 3 sections:

1. PROBLEM: The primary medical issue(s) identified (include severity and timing)
2. INTERVENTION: Specific actions taken to address the problem(s)
3. EVALUATION: Assessment of the intervention's effectiveness


CONVERSATION:
{transcript}
"""

    try:
        response = generate_llm(PIE).invoke(prompt.format(transcript=transcript))
        return {
            "problem": response.problem,
            "intervention": response.intervention,
            "evaluation": response.evaluation,
        }
    except Exception:
        return {
            "problem": "Unable to parse response",
            "intervention": "",
            "evaluation": "",
            "raw_response": str(response) if "response" in locals() else None,
        }
