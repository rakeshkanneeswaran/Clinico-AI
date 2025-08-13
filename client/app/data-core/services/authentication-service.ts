
import { prisma } from "../db";
import { randomBytes } from "crypto";

export class AuthenticationService {
    static async login(username: string, password: string): Promise<{ sessionToken: string }> {
        const user = await prisma.user.findUnique({
            where: { email: username },
        });

        if (!user || user.password !== password) {
            throw new Error("Invalid credentials");
        }

        const sessionToken = randomBytes(32).toString("hex");

        // Store the session in the database
        await prisma.userSession.create({
            data: {
                userId: user.id,
                token: sessionToken,
                expiresAt: new Date(Date.now() + 3600000), // 1 hour expiration
            },
        });

        return { sessionToken: sessionToken };
    }

    static async authenicateSession(token: string): Promise<boolean> {
        const session = await prisma.userSession.findUnique({
            where: { token },
        });

        if (!session || session.expiresAt < new Date()) {
            return false;
        }
        await prisma.userSession.update({
            where: { token },
            data: { expiresAt: new Date(Date.now() + 3600000) },
        });

        return true;
    }


    static async logout(token: string): Promise<void> {
        await prisma.userSession.deleteMany({
            where: { token },
        });
    }
    static async getUserBySession(token: string) {

        if (!token) {
            throw new Error("Session token not provided");
        }


        const session = await prisma.userSession.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!session) {
            throw new Error("Session not found");
        }



        // await prisma.userAccessLog.create({
        //     data: {
        //         userId: session.userId,
        //         accessedAt: new Date(),
        //     },
        // });

        return session.user;
    }

}