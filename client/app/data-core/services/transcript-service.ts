import { prisma } from "../db";

export class TranscriptService {

    static async updateTranscript({
        sessionId,
        content,
    }: {
        sessionId: string;
        content: string;
    }): Promise<{ success: boolean }> {
        if (!sessionId || !content) {
            throw new Error("Session ID or content not provided");
        }
        const existingTranscript = await prisma.transcript.findFirst({
            where: {
                sessionId,
            },
        });
        if (existingTranscript) {
            console.log("Updating existing transcript for session:", sessionId);
            await prisma.transcript.update({
                where: {
                    id: existingTranscript.id,
                },
                data: {
                    content: content
                }
            })
            return {
                success: true,
            };
        }
        console.log("Creating new transcript for session:", sessionId);
        await prisma.transcript.create({
            data: {
                sessionId,
                content: content,
            },
        });
        return {
            success: true,
        };

    }

    static async getTranscriptBySessionId(sessionId: string) {
        if (!sessionId) {
            throw new Error("Session ID not provided");
        }
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
            content: transcript.content || "",
        };
    }

}