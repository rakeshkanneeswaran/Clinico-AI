"use server";
import { S3Service } from "../data-core/services/s3-service";
import { DocumentService } from "@/data-core/services/document-service";

export async function uploadedFileToS3(file: File): Promise<string> {
    if (!file) {
        throw new Error("No file selected");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileKey = await S3Service.uploadFile(buffer);
    return fileKey

}

export async function generateTranscription(s3FileName: string): Promise<{ s3_file_name: string; transcript: string; message: string }> {
    if (!s3FileName) {
        throw new Error("No S3 file name provided");
    }

    const response = await DocumentService.generateTranscription({ s3_file_path: s3FileName });
    return response;
}


export async function generateDocument(transcript: string, document_type: string): Promise<string> {
    if (!transcript || !document_type) {
        throw new Error("Transcription or document type not provided");
    }
    const response = await DocumentService.generateDocument({ transcript, document_type });
    return response;
}       