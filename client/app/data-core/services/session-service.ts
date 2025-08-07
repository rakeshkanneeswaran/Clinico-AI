import { prisma } from "../db";

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

}