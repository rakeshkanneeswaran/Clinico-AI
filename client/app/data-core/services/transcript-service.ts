import { prisma } from "../db";

export class TranscriptService {
    static async updateTranscript({
        sessionId,
        content,
    }: {
        sessionId: string;
        content: string;
    }): Promise<{ success: boolean }> {
        try {
            if (!sessionId || !content) {
                throw new Error("Session ID or content not provided");
            }

            const existingTranscript = await prisma.transcript.findFirst({
                where: { sessionId },
            });

            if (existingTranscript) {
                console.log("Updating existing transcript for session:", sessionId);
                await prisma.transcript.update({
                    where: { id: existingTranscript.id },
                    data: { content },
                });
            } else {
                console.log("Creating new transcript for session:", sessionId);
                await prisma.transcript.create({
                    data: { sessionId, content },
                });
            }

            return { success: true };
        } catch (error) {
            console.error("Error in updateTranscript:", {
                message: (error as Error).message,
                stack: (error as Error).stack,
                sessionId,
                contentPreview: content?.slice(0, 100), // logs only a preview of content for safety
            });
            return { success: false };
        }
    }

    static async getTranscriptBySessionId(sessionId: string) {
        try {
            if (!sessionId) {
                throw new Error("Session ID not provided");
            }

            const transcript = await prisma.transcript.findFirst({
                where: { sessionId },
            });

            if (!transcript) {
                console.log(
                    "No transcript found for session:",
                    sessionId,
                    "returning empty content"
                );
                return {
                    success: true,
                    content: "",
                };
            }

            return {
                success: true,
                content: transcript.content || "",
            };
        } catch (error) {
            console.error("Error in getTranscriptBySessionId:", {
                message: (error as Error).message,
                stack: (error as Error).stack,
                sessionId,
            });
            return {
                success: false,
                content: "",
            };
        }
    }
}
