import os
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from service.transcription_service import transcribeS3Audio
from service.document_service import generate_document
import uvicorn
from datetime import datetime, timezone
from core.document_generator.answer_generator import answer_query
from typing import List
from core.model.llm_schemas import create_dynamic_model
from core.document_generator.custom_document_generator import generate_custom_document
from dotenv import load_dotenv
from cofig import server_config

load_dotenv()

CLINICO_AI_API_KEY = os.getenv("CLINICO_AI_API_KEY")


class UserData(BaseModel):
    s3_file_path: str


class DocumentField(BaseModel):
    label: str
    description: str


class DocumentData(BaseModel):
    transcript: str
    document_type: str  # e.g., "SOAP", "DAP", "PIE"
    fields: List[DocumentField]


class DocumentDataNonCustom(BaseModel):
    transcript: str
    document_type: str


app = FastAPI()


@app.middleware("http")
async def check_api_key(request: Request, call_next):
    # Skip API key check if disabled in config
    if not server_config.get("check_api_key", True):
        return await call_next(request)

    # Proceed with API key verification
    api_key = request.headers.get("CLINICO_AI_API_KEY")
    if api_key != CLINICO_AI_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid API Key")
    return await call_next(request)


@app.middleware("http")
async def run_on_every_request(request: Request, call_next):
    print("AI Server Hit")
    response = await call_next(request)
    return response


@app.post("/api/generate-transcription")
def handle_transcription(user_data: UserData):
    s3_file_name = user_data.s3_file_path
    print(f"[INFO] 🤖 Transcribing audio file from S3: {s3_file_name}")
    transcript = transcribeS3Audio(s3_file_name)
    print("[INFO] 🤖 Transcription completed")
    return {
        "message": "File downloaded successfully",
        "s3_file_name": s3_file_name,
        "transcript": transcript,
    }


@app.post("/api/generate-document")
def handle_document_generation(document_data: DocumentDataNonCustom):
    print(f"[INFO] 🤖 Generating document for type: {document_data.document_type}")
    transcript = document_data.transcript
    document_type = document_data.document_type.lower()

    document = generate_document(transcript, document_type)
    timestamp = datetime.now(timezone.utc).isoformat()
    response = {
        "status": "success",
        "timestamp": timestamp,
        "data": {
            "document_type": document_type.upper(),
            "generated_document": document,
        },
    }

    return response


@app.post("/api/generate-custom-document")
def handle_custom_document_generation(document_data: DocumentData):
    try:
        transcript = document_data.transcript
        document_type = document_data.document_type.lower()

        # Create dynamic model based on provided fields
        custom_model = create_dynamic_model(
            document_data.fields, f"Dynamic{document_type.capitalize()}Model"
        )

        # Generate the document
        document = generate_custom_document(transcript, custom_model, document_type)

        timestamp = datetime.now(timezone.utc).isoformat()
        print(f"[INFO] 🤖 Custom document generated for type: {document_type}")
        print(f"[INFO] Document content: {document}")
        return {
            "status": "success",
            "timestamp": timestamp,
            "data": {
                "document_type": document_type.upper(),
                "generated_document": document,
            },
        }

    except Exception as e:
        print(f"[ERROR] in custom document generation: {str(e)}")
        raise HTTPException(
            status_code=400, detail=f"Failed to generate document: {str(e)}"
        )


class QueryRequest(BaseModel):
    query: str
    contexts: List[str]  # Changed from list[str] to List[str]


@app.post("/api/generate-answer")
def handle_answer_generation(request: QueryRequest):
    answer = answer_query(request.query, request.contexts)
    return {"status": "success", "answer": answer}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
