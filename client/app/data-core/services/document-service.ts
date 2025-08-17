import { prisma } from "../db/index";
import { SessionService } from "./session-service";
import { UserService } from "./user-service";



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
export interface CustomDocument {
    name: string;
    description: string;
    fields: DocumentField[];
}

interface DocumentField {
    label: string;
    description: string;
}

interface CustomDocumentRequest {
    transcript: string;
    document_type: string;
    fields: DocumentField[];
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
                "CLINICO_AI_API_KEY": process.env.CLINICO_AI_API_KEY!,
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

    static async generateDocument({ transcript, document_type, custom, template_id }: { transcript: string; document_type: string, custom: boolean, template_id: string }) {
        // Call the backend service to generate the document based on the transcription and document type
        console.log("Generating document for:", document_type, "<>", template_id);
        if (!transcript || !document_type) {
            throw new Error("Transcription or document type not provided");
        }
        console.log("apikey", process.env.CLINICO_AI_API_KEY);

        console.log("custom", custom);
        if (custom) {
            const data = await DocumentService.generateCustomDocument({
                transcript,
                document_type,
                template_id
            });

            return {
                status: "success",
                data: {
                    generated_document: data.data.generated_document
                }
            };

        }
        const response = await fetch(`${process.env.AI_URL}/api/generate-document`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CLINICO_AI_API_KEY": process.env.CLINICO_AI_API_KEY!,
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
        console.log("Generated document data:", data);
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
                type: documentType.toUpperCase() as string,
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
                type: documentType.toUpperCase() as string,
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
                type: documentType.toUpperCase() as string,
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

    static async createCustomDocument({ sessionId, customDocument }: { sessionId: string; customDocument: CustomDocument }) {

        // Create a new custom document in the database
        if (!sessionId || !customDocument) {
            throw new Error("Missing required fields to create custom document");
        }
        const userId = await UserService.getUserIdBySessionId(sessionId);
        if (!userId) {
            throw new Error("User not found for the given session ID");
        }
        const DocumentExists = await prisma.customDocument.findFirst({
            where: {
                UserId: userId,
                DocumentName: customDocument.name,
            },
        });

        if (DocumentExists) {
            console.log("Custom document already exists for user:", userId);
            return {
                success: false,
                message: "Custom document already exists",
            };
        }

        // Create Custom Document
        const customDocumentData = await prisma.customDocument.create({
            data: {
                DocumentName: customDocument.name,
                Description: customDocument.description,
                UserId: userId,
                content: "",
            },
        });

        // Add fields to the custom document
        await Promise.all(customDocument.fields.map(field => {
            return prisma.fields.create({
                data: {
                    FieldName: field.label,
                    FieldDescription: field.description,
                    customDocumentId: customDocumentData.id,
                },
            });
        }));

        return {
            success: true,
        };
    }

    static async getCustomDocumentBySession({ sessionId }: { sessionId: string }) {
        const userId = await UserService.getUserIdBySessionId(sessionId);
        if (!userId) {
            throw new Error("User not found for the given session ID");
        }

        console.log("Fetching custom document for user:", userId);

        const customDocument = await prisma.customDocument.findMany({
            where: {
                UserId: userId,

            },
            include: {
                fields: true,
            }
        });

        console.log("Custom document fetched for user:", userId, "Documents:", customDocument);

        return {
            success: true,
            customDocument: customDocument,
        };
    }

    static async generateCustomDocument({
        transcript,
        document_type,
        template_id
    }: {
        transcript: string;
        document_type: string;
        template_id: string;
    }) {

        console.log("Generating custom document using template:", template_id);
        // 1. First fetch the template
        const template = await prisma.customDocument.findUnique({
            where: { id: template_id },
            include: { fields: true }
        });

        if (!template) {
            throw new Error("Template not found");
        }

        // 2. Prepare the request payload
        const requestData: CustomDocumentRequest = {
            transcript,
            document_type,
            fields: template.fields.map(field => ({
                label: field.FieldName,
                description: field.FieldDescription
            }))
        };

        console.log("Generating custom document using template:", template.DocumentName);

        // 3. Call the AI service
        const response = await fetch(`${process.env.AI_URL}/api/generate-custom-document`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CLINICO_AI_API_KEY": process.env.CLINICO_AI_API_KEY!,
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            if (response.status === 400) {
                return {
                    status: "error",
                    data: {
                        generated_document: {
                            error: "Failed to generate custom document",
                            details: await response.text()
                        }
                    }
                };
            }
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // 4. Format the response
        return {
            status: "success",
            data: {
                generated_document: data.data.generated_document,
                template_used: {
                    id: template.id,
                    name: template.DocumentName
                }
            }
        };
    }

    static async updateCustomDocument({ templateId, content }: { templateId: string; content: string }) {

        const updatedDocument = await prisma.customDocument.update({
            where: { id: templateId },
            data: {
                content: JSON.stringify(content),
                updatedAt: new Date(),
            },
        });

        console.log("Custom document updated for user:", templateId, "Document:", updatedDocument);

        return {
            success: true,
            customDocument: updatedDocument,
        };
    }

    static async getSpecificCustomDocument({ templateId }: { templateId: string }) {
        const customDocument = await prisma.customDocument.findUnique({
            where: { id: templateId },
            select: {
                content: true
            }
        });

        if (!customDocument) {
            throw new Error("Custom document not found");
        }

        return {
            success: true,
            content: customDocument.content,
        };
    }
    static async deleteCustomDocument({ templateId }: { templateId: string }) {
        const deletedDocument = await prisma.customDocument.delete({
            where: { id: templateId },
        });

        console.log("Custom document deleted for user:", templateId, "Document:", deletedDocument);

        return {
            success: true,
            message: "Custom document deleted successfully",
        };
    }

    static async getSpecificCustomDocumentForView({ templateId }: { templateId: string }) {
        const customDocument = await prisma.customDocument.findUnique({
            where: { id: templateId },
            include: {
                fields: true
            }

        });

        if (!customDocument) {
            throw new Error("Custom document not found");
        }

        return {
            success: true,
            content: customDocument
        };
    }

}