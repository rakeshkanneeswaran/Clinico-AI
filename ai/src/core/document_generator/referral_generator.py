from core.model.model import generate_llm
from core.model.llm_schemas import Referral


def generate_referral(transcript):
    prompt = """
You are a medical scribe. Based on the following doctor-patient conversation, generate only the following sections for a Referral note:

1. Reason for Referral: Briefly describe the patient's problem and why they are being referred.  
2. Relevant Medical History: Summarize important past illnesses, medications, allergies, and tests.  
3. Current Findings: Summarize physical exam, vital signs, lab, or imaging results if any.  
4. What the Referring Doctor Requests: Describe what the referring doctor expects from the specialist.

Do NOT generate patient information, doctor details, or signature — those will be added later.

**Conversation:**  
{transcript}
"""

    try:
        response = generate_llm(Referral).invoke(prompt.format(transcript=transcript))

        referral_json = {
            # Template placeholders — fill these with actual data later
            "patient_info": "[Patient Full Name, Age, Gender, Patient ID or Medical Record Number]",
            "date_of_referral": "[Date of Referral]",
            "referring_doctor_info": {
                "name": "[Referring Doctor's Name]",
                "contact": "[Referring Doctor's Contact Details]",
                "clinic": "[Referring Doctor's Clinic or Hospital Name]",
            },
            "recipient_specialist_info": {
                "name": "[Recipient Specialist's Name]",
                "specialty": "[Specialist's Specialty]",
                "clinic": "[Specialist's Clinic or Hospital Name]",
                "contact": "[Specialist's Contact Information]",
            },
            "reason_for_referral": response.reason_for_referral,
            "relevant_medical_history": response.relevant_medical_history,
            "current_findings": response.current_findings,
            "referring_doctor_requests": response.referring_doctor_requests,
            # Closing
            "closing_and_signature": "[Referring Doctor's Signature and Contact Information]",
        }

        return referral_json

    except Exception:
        return {
            "patient_info": "Unable to parse response",
            "reason_for_referral": "",
            "transcript": "",
            "raw_response": str(response) if "response" in locals() else None,
        }
