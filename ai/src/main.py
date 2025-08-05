from fastapi import FastAPI, Request
from pydantic import BaseModel
from service.transcription_service import transcribeS3Audio
from service.document_service import generate_document
import uvicorn
from datetime import datetime, timezone


class UserData(BaseModel):
    s3_file_path: str


class DocumentData(BaseModel):
    transcript: str
    document_type: str  # e.g., "SOAP", "DAP", "PIE"


app = FastAPI()


@app.middleware("http")
async def run_on_every_request(request: Request, call_next):
    print("AI Server Hit")
    response = await call_next(request)
    return response


@app.post("/api/generate-transcription")
def handle_transcription(user_data: UserData):
    s3_file_name = user_data.s3_file_path
    transcript = transcribeS3Audio(s3_file_name)
    return {
        "message": "File downloaded successfully",
        "s3_file_name": s3_file_name,
        "transcript": transcript,
    }


@app.post("/api/generate-document")
def handle_document_generation(document_data: DocumentData):
    transcript = document_data.transcript
    document_type = document_data.document_type.lower()
    print(f"[INFO] 📄 Generating '{document_type}' document...")

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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
