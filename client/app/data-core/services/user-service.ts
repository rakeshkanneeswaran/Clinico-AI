import { prisma } from "../db";

export class UserService {
    static async createUser(data: { name: string; email: string; password: string }) {
        const { name, email, password } = data;
        // check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
            },
        });
        return user;
    }
    static async getUserDataByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}

