from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from service.transcription_service import transcribeS3Audio
from service.document_service import generate_document
import uvicorn
from datetime import datetime, timezone
from core.agents.medical_classification import is_medical_conversation_transcript
from core.document_generator.answer_generator import answer_query


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

    print("[INFO] 🤖 Classifying transcript as medical or non-medical")

    # try:
    #     result = is_medical_conversation_transcript(transcript)

    #     print(f"[INFO] 🏷️ Classification: {result}")

    #     if not result:
    #         print("[ERROR] Transcript is not medical-related")
    #         raise HTTPException(
    #             status_code=400, detail="Transcript is not medical-related"
    #         )

    # except Exception as e:
    #     print(f"[ERROR] Agent execution failed: {str(e)}")
    #     raise HTTPException(
    #         status_code=400, detail="Internal error during classification."
    #     )

    # print(f"[INFO] 📄 Generating '{document_type}' document...")

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


class QueryRequest(BaseModel):
    query: str
    contexts: list[str]


@app.post("/api/generate-answer")
def handle_answer_generation(request: QueryRequest):
    answer = answer_query(request.query, request.contexts)
    return {"status": "success", "answer": answer}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
