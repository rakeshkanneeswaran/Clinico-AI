"use server";
import { UserService } from "@/data-core/services/user-service";
import { SessionService } from "@/data-core/services/session-service";

export async function loginUser(data: { email: string; password: string }) {
    const { email, password } = data;

    // Check if user exists
    const user = await UserService.getUserDataByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    // Validate password (this is a placeholder, implement actual password validation)
    if (user.password !== password) {
        throw new Error("Invalid password");
    }

    const session = await SessionService.createSession({ userId: user.id })

    // Return user data excluding sensitive information
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        session: session,
    };
}