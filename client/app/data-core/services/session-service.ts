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

}