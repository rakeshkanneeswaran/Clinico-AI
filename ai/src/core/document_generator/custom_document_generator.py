from core.model.model import generate_llm
from pydantic import BaseModel, Field
from typing import Dict, Any


class PatientSupportAnalysis(BaseModel):
    need_mental_health: str = Field(
        ...,
        description=(
            "Clearly state 'Yes, mental health support is required because…' "
            "or 'No, mental health support is not required because…'. "
            "Provide reasoning in 2–4 sentences with empathetic explanation."
        ),
    )
    mental_health_reason: str = Field(
        ...,
        description=(
            "Explain in detail (4–6 sentences) why mental health support is or is not needed. "
            "Use simple, compassionate language, focusing on the patient’s emotional state, "
            "symptoms, and potential benefits of counseling or therapy. "
            "If not required, clearly write 'Not required in this case' with explanation."
        ),
    )
    need_legal_help: str = Field(
        ...,
        description=(
            "Clearly state 'Yes, legal help is required under Indian law because…' "
            "or 'No, legal help is not required because…'. "
            "Provide reasoning in 2–4 sentences."
        ),
    )
    legal_reason: str = Field(
        ...,
        description=(
            "Explain in detail (4–6 sentences) why legal help is or is not needed. "
            "If required, mention relevant Indian laws (e.g., Domestic Violence Act, IPC sections) "
            "in simple, supportive terms. "
            "If not required, clearly write 'Not required in this case' with explanation."
        ),
    )
    urgency_level: str = Field(
        ...,
        description=(
            "Categorize urgency as 'low', 'moderate', or 'high'. "
            "Then provide a short justification (2–3 sentences) "
            "explaining why this urgency level was chosen."
        ),
    )
    treatment_plan: str = Field(
        ...,
        description=(
            "Provide a clear, supportive next-step plan for the patient in 4–6 sentences. "
            "If mental health support is needed, suggest therapy, counseling, or helplines. "
            "If legal help is needed, suggest approaching protection officers, NGOs, or legal aid services. "
            "If neither is required, provide supportive reassurance and healthy coping suggestions."
        ),
    )
    need_mental_health: str = Field(
        ...,
        description=(
            "Clearly state 'Yes, mental health support is required because…' "
            "or 'No, mental health support is not required because…'. "
            "Provide reasoning in 2–4 sentences with empathetic explanation."
        ),
    )
    mental_health_reason: str = Field(
        ...,
        description=(
            "Explain in detail (4–6 sentences) why mental health support is or is not needed. "
            "Use simple, compassionate language, focusing on the patient’s emotional state, "
            "symptoms, and potential benefits of counseling or therapy. "
            "If not required, clearly write 'Not required in this case' with explanation."
        ),
    )
    need_legal_help: str = Field(
        ...,
        description=(
            "Clearly state 'Yes, legal help is required under Indian law because…' "
            "or 'No, legal help is not required because…'. "
            "Provide reasoning in 2–4 sentences."
        ),
    )
    legal_reason: str = Field(
        ...,
        description=(
            "Explain in detail (4–6 sentences) why legal help is or is not needed. "
            "If required, mention relevant Indian laws (e.g., Domestic Violence Act, IPC sections) "
            "in simple, supportive terms. "
            "If not required, clearly write 'Not required in this case' with explanation."
        ),
    )
    urgency_level: str = Field(
        ...,
        description=(
            "Categorize urgency as 'low', 'moderate', or 'high'. "
            "Then provide a short justification (2–3 sentences) "
            "explaining why this urgency level was chosen."
        ),
    )


def analyze_patient_needs(transcript: str):
    """
    Analyze the transcript and identify whether the patient requires
    mental health support, legal advice (under Indian law), or both.
    Always fill every field. If something is not required, explicitly say
    'Not required in this case' with explanation.
    """
    analysis_prompt = f"""
    We are here to support you. We will carefully read what you have shared below
    and then explain what kind of help you may need. We will always give clear answers
    for every section, even if something is not needed.

    Transcript (your words):
    {transcript}

    Instructions for response:
    - Always fill every field of the structured output.
    - Do NOT leave any field blank or empty.
    - If something is not needed, explicitly write "Not required in this case"
      and explain briefly why.
    - Speak directly to the patient in first person plural ("we believe", "we suggest", "we feel").
    - For mental health fields, give compassionate reasoning in simple language.
    - For legal fields, explain gently and mention relevant Indian laws if applicable.
    - For urgency, always provide both a category and justification.
    - Expand responses with empathetic detail (not just one sentence).
    """

    try:
        model = generate_llm(PatientSupportAnalysis)
        response = model.invoke(analysis_prompt)
        return response.dict()

    except Exception as e:
        print(f"[ERROR] Analysis failed: {str(e)}")
        return {"error": "Analysis failed", "exception": str(e)}


def translate_document(
    json_object: Dict[str, Any], target_language: str
) -> Dict[str, Any]:
    """
    Translate the entire JSON document content to the target language while preserving the structure.

    Args:
        json_object: The JSON object containing the analysis results in English
        target_language: The language to translate to (e.g., 'Hindi', 'Spanish', 'French')

    Returns:
        Dict[str, Any]: Translated JSON object with same structure but content in target language
    """
    translation_prompt = f"""
    Translate the following JSON document content to {target_language}. 
    Preserve the exact JSON structure and field names. Only translate the string values.
    Maintain the same tone, empathy, and professional style in the translation.
    Keep legal terms and act names accurate but translated appropriately.
    
    Original JSON:
    {json_object}
    
    Instructions:
    - Translate all text content to {target_language}
    - Keep the JSON structure identical
    - Maintain the original meaning and tone
    - Ensure legal terminology is accurately translated
    - Preserve the empathetic and supportive language
    - Return only the translated JSON object
    """

    try:
        print("language:", target_language)

        class TranslatedDocument(BaseModel):
            need_mental_health: str
            mental_health_reason: str
            need_legal_help: str
            legal_reason: str
            urgency_level: str
            treatment_plan: str

        translation_model = generate_llm(TranslatedDocument)
        translated_response = translation_model.invoke(translation_prompt)

        return translated_response.dict()

    except Exception as e:
        print(f"[ERROR] Translation failed: {str(e)}")
        return {**json_object, "translation_error": str(e)}
