import { prisma } from "../db/index";
import { UserService } from "./user-service";
import winston from "winston";
import { GenerateTranscriptionResponse, Template, GenerateDocumentRequest } from "./types";




const logger = winston.createLogger({
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] [${level}] ${message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

export class DocumentService {

    static async generateTranscription({ s3_file_path, session_id }: { s3_file_path: string, session_id: string }) {
        logger.debug(`Starting transcription generation for file: ${s3_file_path}, session: ${session_id}`);

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
        const transcriptExists = await prisma.transcript.findFirst({ where: { sessionId: session_id } });

        if (transcriptExists) {
            logger.debug(`Updating existing transcript for session: ${session_id}`);
            await prisma.transcript.update({
                where: { id: transcriptExists.id },
                data: { content: data.transcript },
            });
        } else {
            logger.debug(`Creating new transcript entry for session: ${session_id}`);
            await prisma.transcript.create({
                data: { sessionId: session_id, content: data.transcript },
            });
        }

        logger.info(`Transcription successfully generated for session: ${session_id}`);
        return data;
    }

    static async createTemplate(templateData: { sessionId: string; Template: Template }) {
        if (!templateData.sessionId || !templateData.Template) {
            throw new Error("Missing required fields to create custom document");
        }

        const userId = await UserService.getUserIdBySessionId(templateData.sessionId);
        if (!userId) {
            throw new Error("User not found for the given session ID");
        }

        const TemplateExisits = await prisma.template.findFirst({
            where: { name: templateData.Template.name },
        });

        if (TemplateExisits) {
            logger.warn(`Template "${templateData.Template.name}" already exists for user: ${userId}`);
            return { success: false, message: "Template already exists" };
        }

        await prisma.$transaction(async (tx) => {
            const createdTemplate = await tx.template.create({
                data: {
                    name: templateData.Template.name,
                    description: templateData.Template.description,
                },
            });

            templateData.Template.fields.forEach(async (field) => {
                await tx.field.create({
                    data: {
                        name: field.label,
                        description: field.description,
                        templateId: createdTemplate.id,
                    },
                });
            });

            await tx.userTemplate.create({
                data: { userId: userId, templateId: createdTemplate.id },
            });
        });

        logger.info(`Template "${templateData.Template.name}" successfully created for user: ${userId}`);
        return { success: true, message: "Template created successfully" };
    }

    static async getAllUserTemplates({ sessionId }: { sessionId: string }) {
        const userId = await UserService.getUserIdBySessionId(sessionId);
        if (!userId) {
            throw new Error("User not found for the given session ID");
        }

        const userTemplates = await prisma.userTemplate.findMany({
            where: { userId },
            select: {
                id: true,
                template: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        logger.debug(`Fetched ${userTemplates.length} templates for user: ${userId}`);
        return userTemplates;
    }



    static async createSessionDocument({ sessionId, userId, userTemplateId, content }: { sessionId: string; userId: string; userTemplateId: string; content: string }) {
        logger.debug(`Creating session document for session: ${sessionId}, user: ${userId}`);

        if (!sessionId || !userId || !content) {
            throw new Error("Missing required fields to create document");
        }

        await prisma.sessionDocument.create({
            data: {
                sessionId,
                userTemplateId,
                content: JSON.stringify(content),
            },
        });

        logger.info(`Session document created for session: ${sessionId}, user: ${userId}`);
        return { success: true, message: "Session document created successfully" };
    }

    static async getSessionDocumentById({ sessionId, sessionDocumentId }: { sessionId: string, sessionDocumentId: string }) {
        const sessionDocument = await prisma.sessionDocument.findFirst({
            where: { sessionId, id: sessionDocumentId },
        });

        if (!sessionDocument) {
            logger.warn(`No document found for session: ${sessionId}, documentId: ${sessionDocumentId}`);
            return { success: true, content: "" };
        }

        logger.debug(`Fetched document for session: ${sessionId}, documentId: ${sessionDocumentId}`);
        return { success: true, content: sessionDocument?.content || "" };
    }

    static async getTranscriptBySession({ sessionId }: { sessionId: string }) {
        const transcript = await prisma.transcript.findFirst({ where: { sessionId } });

        if (!transcript) {
            logger.warn(`No transcript found for session: ${sessionId}`);
            return { success: true, content: "" };
        }

        logger.debug(`Transcript fetched for session: ${sessionId}`);
        return { success: true, content: transcript?.content || "" };
    }

    static async generateSessionDocument({
        transcript,
        userTemplateId,
        sessionId,
    }: {
        transcript: string;
        userTemplateId: string;
        sessionId: string;
    }) {
        logger.debug(`Generating session document for session: ${sessionId}, template: ${userTemplateId}`);


        const userTemplate = await prisma.userTemplate.findFirst({
            where: { id: userTemplateId },
            select: {
                template: {
                    select: {
                        name: true,
                        id: true,
                        fields: true
                    }
                }
            }
        });

        console.log("Template fetched:", userTemplate);

        if (!userTemplate) {
            throw new Error("Template not found");
        }

        const requestData: GenerateDocumentRequest = {
            transcript,
            document_type: userTemplate.template.name,
            fields: userTemplate.template.fields.map(field => ({
                name: field.name,
                label: field.name,
                description: field.description
            }))
        };

        logger.debug(`Sending transcript to AI for document generation using template: ${userTemplate.template.name}`);

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
                logger.error(`AI service failed to generate custom document for session: ${sessionId}`);
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

        logger.info(`Custom document generated successfully for session: ${sessionId}, template: ${userTemplate.template.name}`);
        return {
            status: "success",
            data: {
                generated_document: data.data.generated_document,
                template_used: { id: userTemplate.template.id, name: userTemplate.template.name }
            }
        };
    }



    static async getSpecificSessionDocument({ sessionId, sessionDocumentId }: { sessionId: string; sessionDocumentId: string }) {
        const sessionDocument = await prisma.sessionDocument.findUnique({
            where: { id: sessionDocumentId, sessionId: sessionId },
            select: { content: true }
        });

        if (!sessionDocument) {
            throw new Error("Session document not found");
        }

        logger.debug(`Fetched specific document for session: ${sessionId}, documentId: ${sessionDocumentId}`);
        return { success: true, content: sessionDocument.content };
    }

    static async deleteSessionDocument({ sessionId, sessionDocumentId }: { sessionId: string; sessionDocumentId: string }) {
        const deletedDocument = await prisma.sessionDocument.delete({
            where: { id: sessionDocumentId, sessionId: sessionId },
        });

        logger.info(`Session document deleted for session: ${sessionId}, documentId: ${sessionDocumentId}`);
        return { success: true, message: "Session document deleted successfully" };
    }

    static async saveSessionDocument({ sessionId, content, sessionDocumentId, userTemplateId }: { sessionId: string; content: string; sessionDocumentId: string; userTemplateId: string }) {

        // check if the document already exists
        const existingDocument = await prisma.sessionDocument.findFirst({
            where: { id: sessionDocumentId, sessionId: sessionId, userTemplateId: userTemplateId },
        });

        if (existingDocument) {
            // update the existing document
            const updatedDocument = await prisma.sessionDocument.update({
                where: { id: sessionDocumentId },
                data: { content: JSON.stringify(content), updatedAt: new Date() },
            });
            logger.info(`Session document updated for session: ${sessionId}, documentId: ${sessionDocumentId}`);
            return { success: true, message: "Session document updated successfully", sessionDocument: updatedDocument };
        }
        else {
            // create a new document
            const newDocument = await prisma.sessionDocument.create({
                data: {
                    sessionId,
                    userTemplateId,
                    content: JSON.stringify(content),
                },
            });
            logger.info(`Session document created for session: ${sessionId}, documentId: ${newDocument.id}`);
            return { success: true, message: "Session document created successfully", sessionDocument: newDocument };
        }

    }

    static async getAllSessionDocuments({ sessionId }: { sessionId: string }) {
        const sessionDocuments = await prisma.sessionDocument.findMany({
            where: { sessionId },
            include: {
                userTemplate: {
                    select: {
                        template: {
                            select:
                            {
                                name: true,
                                description: true,
                                fields: true
                            }
                        }
                    }
                }
            }

        });
        return sessionDocuments;
    }

    static async getAllCreatedTemplatesByUserId({ userId }: { userId: string }) {
        const templates = await prisma.template.findMany({
            where: {
                userTemplates: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                fields: true,
                userTemplates: true

            }

        });
        return templates;
    }

    static async deleteTemplate({ userTemplateId }: { userTemplateId: string }) {
        return prisma.$transaction(async (tx) => {
            // Step 1: Ensure the userTemplate exists and fetch its template + relations
            const userTemplate = await tx.userTemplate.findFirst({
                where: { id: userTemplateId },
                include: { template: { include: { userTemplates: true } } },
            });

            if (!userTemplate) {
                throw new Error("User template not found");
            }

            const templateId = userTemplate.templateId;

            // Step 2: Delete all session documents linked to this userTemplate
            await tx.sessionDocument.deleteMany({
                where: { userTemplateId },
            });

            // Step 3: Delete the userTemplate itself
            await tx.userTemplate.delete({
                where: { id: userTemplateId },
            });

            // Step 4: If no other userTemplates exist for this template, clean it up fully
            if (userTemplate.template.userTemplates.length === 1) {
                // Delete fields attached to the template
                await tx.field.deleteMany({
                    where: { templateId },
                });

                // Delete the template itself
                await tx.template.delete({
                    where: { id: templateId },
                });
            }

            return { success: true, message: "Template deleted successfully" };
        });
    }
}


