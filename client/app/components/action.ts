"use server";
import { S3Service } from "../data-core/services/s3-service";
import { DocumentService } from "@/data-core/services/document-service";
import { SessionService } from "@/data-core/services/session-service";
import { PatientService } from "@/data-core/services/patient-service";
import { TranscriptService } from "@/data-core/services/transcript-service";

export async function uploadedFileToS3(file: File): Promise<string> {
    if (!file) {
        throw new Error("No file selected");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileKey = await S3Service.uploadFile(buffer);
    return fileKey

}

export async function generateTranscription(s3FileName: string, sessionId: string): Promise<{ s3_file_name: string; transcript: string; message: string }> {
    if (!s3FileName) {
        throw new Error("No S3 file name provided");
    }

    const response = await DocumentService.generateTranscription({ s3_file_path: s3FileName, session_id: sessionId });
    return response;
}




export async function saveDocument(data: { userId: string; documentType: string; content: string, sessionId: string }): Promise<boolean> {

    const document = await DocumentService.createDocument(data)
    return document.success;

}

export async function generateDocument({ transcript, document_type }: { transcript: string; document_type: string }): Promise<{
    status: string;
    data: {
        generated_document: string;
    };
}> {
    if (!transcript || !document_type) {
        throw new Error("Transcription or document type not provided");
    }
    const response = await DocumentService.generateDocument({ transcript, document_type });

    return response;
}

export async function getDocumentBySession({ sessionId, documentType }: { sessionId: string; documentType: string }): Promise<string | null> {
    if (!sessionId || !documentType) {
        throw new Error("Session ID or document type not provided");
    }
    const response = await DocumentService.getDocumentBySession({ sessionId, documentType });
    return response ? response.content : null;
}

export async function getTranscriptBySession({ sessionId }: { sessionId: string }): Promise<string | null> {
    if (!sessionId) {
        throw new Error("Session ID not provided");
    }
    const response = await DocumentService.getTranscriptBySession({ sessionId });
    return response ? response.content : null;
}

export async function createSession({ userId }: { userId: string }): Promise<string> {
    if (!userId) {
        throw new Error("User ID not provided");
    }
    const session = await SessionService.createSession({ userId });
    return session.sessionId;
}


export async function createPatient(data: {
    name: string;
    age: string;
    gender: string;
    weight: string;
    height: string;
    bloodType: string;
    sessionId: string;
}): Promise<string> {
    if (!data.name || !data.age || !data.gender || !data.weight || !data.height || !data.bloodType || !data.sessionId) {
        throw new Error("All fields are required");
    }

    const patient = await PatientService.createPatient(data);
    return patient.id;
}

export async function getPatientBySession(sessionId: string): Promise<{ id: string; name: string; age: string; gender: string; weight: string; height: string; bloodType: string }> {
    if (!sessionId) {
        throw new Error("Session ID not provided");
    }

    const patient = await PatientService.getPatientBySessionId(sessionId);
    return patient;
}


async function getTranscriptBySessionId(sessionId: string) {

    try {
        const transcript = await TranscriptService.getTranscriptBySessionId(sessionId);
        return transcript.content
    } catch (error) {
        console.error("Error fetching transcript by session ID:", error);
        throw new Error("Failed to fetch transcript");

    }

}

export async function saveTranscript(sessionId: string, content: string) {
    try {
        const result = await TranscriptService.updateTranscript({ sessionId, content });
        return result.success;
    } catch (error) {
        console.error("Error saving transcript:", error);
        throw new Error("Failed to save transcript");
    }
}