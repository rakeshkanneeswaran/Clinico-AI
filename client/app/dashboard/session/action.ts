"use server";
import { DocumentService } from "@/data-core/services/document-service";



export async function generateDocument({ transcript, document_type }: { transcript: string; document_type: string }) {
    if (!transcript || !document_type) {
        throw new Error("Transcription or document type not provided");
    }
    const response = await DocumentService.generateDocument({ transcript, document_type });
    return response;
}


