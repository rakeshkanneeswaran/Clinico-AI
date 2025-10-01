# ============================================================
# 🏥 Clinico AI Server — FastAPI Backend
# Handles transcription, document generation, and chat responses
# ============================================================

# -------------------------------
# 🔹 Standard Library Imports
# -------------------------------
import os
from datetime import datetime, timezone
from typing import List

# -------------------------------
# 🔹 Third-Party Library Imports
# -------------------------------
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn

# -------------------------------
# 🔹 Internal / Application Imports
# -------------------------------
from cofig import server_config
from service.transcription_service import transcribeS3Audio
from core.model.llm_schemas import create_dynamic_model
from core.document_generator.custom_document_generator import generate_custom_document
from agents.chat_agent.chat_agent import invoke_chat_agent


# ============================================================
# ⚙️ Environment Setup
# ============================================================
load_dotenv()
CLINICO_AI_API_KEY = os.getenv("CLINICO_AI_API_KEY")


# ============================================================
# 📘 Pydantic Models (Request Schemas)
# ============================================================


class UserData(BaseModel):
    """Schema for transcription requests."""

    s3_file_path: str


class DocumentField(BaseModel):
    """Schema for each field in a custom medical document."""

    label: str
    description: str


class DocumentData(BaseModel):
    """Schema for custom document generation requests."""

    transcript: str
    document_type: str
    fields: List[DocumentField]
    doctor_suggestions: str


class DocumentDataNonCustom(BaseModel):
    """Schema for non-custom document generation."""

    transcript: str
    document_type: str


class QueryRequest(BaseModel):
    """Schema for chat query requests."""

    query: str
    session_id: str


# ============================================================
# 🚀 FastAPI App Initialization
# ============================================================
app = FastAPI(title="Clinico AI Backend", version="1.0.0")


# ============================================================
# 🧩 Middleware
# ============================================================


@app.middleware("http")
async def check_api_key(request: Request, call_next):
    """
    Middleware to verify API Key authentication for all requests.
    Skips check if disabled in server_config.
    """
    if not server_config.get("check_api_key", True):
        return await call_next(request)

    api_key = request.headers.get("CLINICO_AI_API_KEY")
    if api_key != CLINICO_AI_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid API Key")

    return await call_next(request)


@app.middleware("http")
async def log_incoming_request(request: Request, call_next):
    """Logs every incoming request for monitoring."""
    print(f"[INFO] 🌐 Incoming request: {request.url.path}")
    response = await call_next(request)
    return response


# ============================================================
# 🧠 API Endpoints
# ============================================================


@app.post("/api/generate-transcription")
def handle_transcription(user_data: UserData):
    """
    Transcribes an audio file from an S3 path into text.
    """
    try:
        s3_file_name = user_data.s3_file_path
        print(f"[INFO] 🎧 Transcribing audio file from S3: {s3_file_name}")

        transcript = transcribeS3Audio(s3_file_name)

        print("[INFO] ✅ Transcription completed successfully.")
        return {
            "status": "success",
            "message": "File transcribed successfully.",
            "s3_file_name": s3_file_name,
            "transcript": transcript,
        }

    except Exception as e:
        print(f"[ERROR] ❌ Transcription failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")


@app.post("/api/generate-custom-document")
def handle_custom_document_generation(document_data: DocumentData):
    """
    Generates a custom medical document based on a transcript,
    provided fields, and doctor suggestions.
    """
    try:
        transcript = document_data.transcript
        document_type = document_data.document_type.lower()
        doctor_suggestions = document_data.doctor_suggestions

        print(f"[INFO] 🩺 Generating custom document for type: {document_type}")
        print(f"[INFO] Doctor's suggestions: {doctor_suggestions}")

        # Create dynamic Pydantic model from provided fields
        custom_model = create_dynamic_model(
            document_data.fields, f"Dynamic{document_type.capitalize()}Model"
        )

        # Generate the document using the transcript and model
        document = generate_custom_document(
            transcript, custom_model, document_type, doctor_suggestions
        )

        timestamp = datetime.now(timezone.utc).isoformat()

        print("[INFO] ✅ Custom document generated successfully.")
        print(f"[INFO] Document content:\n{document}")

        return {
            "status": "success",
            "timestamp": timestamp,
            "data": {
                "document_type": document_type.upper(),
                "generated_document": document,
            },
        }

    except Exception as e:
        print(f"[ERROR] ❌ Document generation failed: {str(e)}")
        raise HTTPException(
            status_code=400, detail=f"Failed to generate custom document: {str(e)}"
        )


@app.post("/api/generate-answer")
def handle_answer_generation(request: QueryRequest):
    """
    Handles medical Q&A or conversation-based requests.
    Uses the chat agent pipeline (RAG + LLM).
    """
    try:
        print(f"[INFO] 💬 Query received: {request.query}")
        answer = invoke_chat_agent(request.query, session_id=request.session_id)
        print("[INFO] ✅ Answer generated successfully.")
        return {"status": "success", "answer": answer}

    except Exception as e:
        print(f"[ERROR] ❌ Chat agent error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat agent error: {str(e)}")


# ============================================================
# 🏁 Entry Point
# ============================================================
if __name__ == "__main__":
    print("[INFO] 🚀 Starting Clinico AI backend...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
