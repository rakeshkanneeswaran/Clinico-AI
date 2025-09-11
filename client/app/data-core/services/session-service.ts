import { prisma } from "../db";
import { RAGService } from "./rag-service";

export class SessionService {
    static async createSession(data: { userId: string }) {
        const { userId } = data;
        const session = await prisma.session.create({
            data: {
                userId,
            },
        });
        return {
            sessionId: session.id,
        }
    }
    static async getAllSessionByUserId({ userId }: { userId: string }) {
        if (!userId) {
            throw new Error("User ID not provided");
        }
        const sessions = await prisma.session.findMany({
            where: {
                userId,
            },
            include: {
                patient: true,
            }
        });
        return sessions.map(session => ({
            id: session.id,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            patient: session.patient ? {
                id: session.patient.id,
                name: session.patient.name,
                age: session.patient.age,
                weight: session.patient.weight,
                height: session.patient.height,
                bloodType: session.patient.bloodType,
                gender: session.patient.gender

            } : null,
        }));
    }

    // delete session and all related data

    static async deleteSession({ sessionId }: { sessionId: string }) {
        if (!sessionId) {
            throw new Error("Session ID not provided");
        }

        const [, , , session] = await prisma.$transaction([
            prisma.patient.deleteMany({ where: { sessionId } }),
            prisma.sessionDocument.deleteMany({ where: { sessionId } }),
            prisma.transcript.deleteMany({ where: { sessionId } }),
            prisma.session.delete({ where: { id: sessionId } }),
        ]);

        const response = await RAGService.deleteVectorStore(sessionId);
        if (response.status !== "success") {
            throw new Error("Failed to delete vector store data");
        }

        return {
            success: true,
            sessionId: session.id,
        };
    }


}