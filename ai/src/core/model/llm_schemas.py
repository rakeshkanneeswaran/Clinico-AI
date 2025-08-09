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
