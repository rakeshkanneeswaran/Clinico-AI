"use server";
import { S3Service } from "../data-core/services/s3-service";
import { DocumentService } from "@/data-core/services/document-service";
import { SessionService } from "@/data-core/services/session-service";

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

export async function generateDocument({ transcript, document_type }: { transcript: string; document_type: string }): Promise<string> {
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
