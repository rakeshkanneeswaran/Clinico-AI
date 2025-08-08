from pydantic import BaseModel, Field


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
    patient_info: str = Field(description="Patient's information")
    reason_for_referral: str = Field(description="Reason for referral")


class Summary(BaseModel):
    summary: str = Field(description="Summary of the conversation or document")


class PIE(BaseModel):
    problem: str = Field(description="Problem identified in the conversation")
    intervention: str = Field(description="Intervention taken for the problem")
    evaluation: str = Field(
        description="Evaluation of the intervention's effectiveness"
    )
