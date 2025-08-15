"use server";
import { DocumentService } from "@/data-core/services/document-service";



export async function generateDocument({ transcript, document_type, custom, template_id }: { transcript: string; document_type: string; custom: boolean; template_id: string; }) {
    if (!transcript || !document_type) {
        throw new Error("Transcription or document type not provided");
    }
    const response = await DocumentService.generateDocument({ transcript, document_type, custom, template_id });
    return response;
}


