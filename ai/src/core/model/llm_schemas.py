from pydantic import BaseModel, Field
from typing import List, Optional


class DAP(BaseModel):
    data: str = Field(description="Patient's complaints or data")
    assessment: str = Field(description="Diagnosis or assessment of the patient")
    plan: str = Field(description="Plan for treatment")


class SOAP(BaseModel):
    subjective: str = Field(description="Patient's subjective complaints")
    objective: str = Field(description="Objective findings from the examination")
    assessment: str = Field(description="Assessment or diagnosis")
    plan: str = Field(description="Plan for treatment or follow-up")


class Referral(BaseModel):
    reason_for_referral: str = Field(description="Reason for referring the patient")
    relevant_medical_history: str = Field(
        description="Relevant medical history summary"
    )
    current_findings: str = Field(description="Current physical exam and test findings")
    referring_doctor_requests: str = Field(
        description="Requested actions or feedback from specialist"
    )


class Summary(BaseModel):
    summary: str = Field(description="Summary of the conversation or document")


class PIE(BaseModel):
    problem: str = Field(description="Problem identified in the conversation")
    intervention: str = Field(description="Intervention taken for the problem")
    evaluation: str = Field(
        description="Evaluation of the intervention's effectiveness"
    )


class Answer(BaseModel):
    answer: str = Field(description="Generated answer based on query and contexts")


class DeepAnalysis(BaseModel):
    """
    Simplified deep analysis of a doctor-patient conversation.
    All fields are now strings to avoid array validation issues.
    """

    # 1. Core Medical Analysis
    patient_complaints: str = Field(
        description="Detailed summary of the patient's reported symptoms and concerns"
    )
    clinical_findings: str = Field(
        description="Objective observations (e.g., exam results, vital signs)"
    )
    primary_diagnosis: str = Field(
        description="Most likely diagnosis based on the conversation"
    )
    differential_diagnoses: Optional[str] = Field(
        None,
        description="Alternative potential diagnoses (comma-separated if multiple)",
    )
    red_flags: Optional[str] = Field(
        None,
        description="Warning signs that need urgent action (comma-separated if multiple)",
    )

    # 2. Treatment & Follow-up
    treatment_plan: str = Field(
        description="Recommended medications, procedures, or therapies"
    )
    lifestyle_recommendations: Optional[str] = Field(
        None, description="Suggested diet, exercise, or habit changes"
    )
    follow_up_actions: str = Field(
        description="Next steps (e.g., tests, appointments, monitoring)"
    )

    # 3. Communication & Context
    communication_quality: str = Field(
        description="Evaluation of doctor's clarity, empathy, and patient engagement"
    )
    patient_understanding: str = Field(
        description="Inferred level of the patient's comprehension"
    )
    missed_questions: Optional[str] = Field(
        None, description="Critical questions the doctor should have asked"
    )
