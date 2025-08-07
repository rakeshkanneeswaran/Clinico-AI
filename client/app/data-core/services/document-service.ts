import { prisma, DocumentType } from "../db/index";

interface GenerateTranscriptionResponse {
    s3_file_name: string;
    transcript: string;
    message: string;
}

interface GenerateDocumentResponse {
    status: string;
    timestamp: string;
    data: {
        document_type: string;
        generated_document: string;
    };

}

export class DocumentService {

    static async generateTranscription({ s3_file_path, session_id }: { s3_file_path: string, session_id: string }) {
        // Call the backend service to process the s3_file_name and return the transcription
        console.log("Generating transcription for:", s3_file_path);
        if (!s3_file_path) {
            throw new Error("No S3 file name provided");
        }
        const response = await fetch(`${process.env.AI_URL}/api/generate-transcription`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ s3_file_path }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate transcription");
        }
        const data: GenerateTranscriptionResponse = await response.json();
        const transcriptExists = await prisma.transcript.findFirst({
            where: {
                sessionId: session_id,
            },
        });

        if (transcriptExists) {
            await prisma.transcript.update({
                where: {
                    id: transcriptExists.id,
                },
                data: {

                    content: data.transcript,

                },
            });
        }
        else {
            await prisma.transcript.create({
                data: {
                    sessionId: session_id,
                    content: data.transcript,
                }
            });
        }

        return data;
    }

    static async generateDocument({ transcript, document_type }: { transcript: string; document_type: string }) {
        // Call the backend service to generate the document based on the transcription and document type
        console.log("Generating document for:", document_type);
        console.log("Transcript:", transcript);
        if (!transcript || !document_type) {
            throw new Error("Transcription or document type not provided");
        }
        const response = await fetch(`${process.env.AI_URL}/api/generate-document`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ transcript, document_type }),
        });

        if (!response.ok) {

            if (response.status === 400) {
                return {
                    status: "error",
                    data: {
                        generated_document: "transcription not related to medical conversation",
                    }
                };
            }
        }
        const data: GenerateDocumentResponse = await response.json();
        return {
            status: "success",
            data: {
                generated_document: data.data.generated_document
            }
        }
    }

    static async createDocument({ sessionId, userId, documentType, content }: { sessionId: string; userId: string; documentType: string; content: string }) {
        // Create a new document in the database
        // check if  document already exists for the same documentType and sessionId
        const existingDocument = await prisma.document.findFirst({
            where: {
                sessionId,
                type: documentType.toUpperCase() as DocumentType,
            },
        });
        if (existingDocument) {
            console.log("Document already exists, updating content for session:", sessionId);
            await prisma.document.update({
                where: {
                    id: existingDocument.id,
                },
                data: {
                    content: JSON.stringify(content),
                },
            });

            return {
                success: true,
            };
        }
        console.log("Creating document for session:", sessionId);
        if (!sessionId || !userId || !documentType || !content) {
            throw new Error("Missing required fields to create document");
        }
        await prisma.document.create({
            data: {
                sessionId,
                type: documentType.toUpperCase() as DocumentType,
                content: JSON.stringify(content),
            },
        });
        return {
            success: true,
        };
    }
    static async getDocumentBySession({ sessionId, documentType }: { sessionId: string, documentType: string }) {
        const document = await prisma.document.findFirst({
            where: {
                sessionId,
                type: documentType.toUpperCase() as DocumentType,
            },
        });
        if (!document) {
            console.log("No document found for session:", sessionId, "and type:", documentType, "returning empty content");
            return {
                success: true,
                content: "",
            };
        }
        return {
            success: true,
            content: document?.content || "",
        };
    }

    static async getTranscriptBySession({ sessionId }: { sessionId: string }) {
        const transcript = await prisma.transcript.findFirst({
            where: {
                sessionId,
            },
        });
        if (!transcript) {
            console.log("No transcript found for session:", sessionId, "returning empty content");
            return {
                success: true,
                content: "",
            };
        }
        return {
            success: true,
            content: transcript?.content || "",
        };
    }
}
