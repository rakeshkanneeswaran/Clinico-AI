from core.model.model import llm


def is_medical_conversation_transcript(transcript: str) -> bool:
    """
    Uses the LLM to determine if the given transcript is a medical conversation.

    Args:
        transcript (str): The conversation transcript to be analyzed.

    Returns:
        bool: True if it's a medical conversation, False otherwise.
    """
    prompt = f"""
You are a helpful assistant. Analyze the following transcript and determine whether it is a medical conversation.

Transcript:
\"\"\"
{transcript}
\"\"\"

Answer with only 'Yes' if it is a medical conversation or 'No' if it is not.
    """

    response = llm.invoke(prompt).strip().lower()
    return response.startswith("yes")
