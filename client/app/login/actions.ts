"use server";
import { cookies } from "next/headers";
import { AuthenticationService } from "@/data-core/services/authentication-service";
import { UserService } from "@/data-core/services/user-service";
import { SessionService } from "@/data-core/services/session-service";

export async function loginUser(data: { email: string; password: string }) {
    const { email, password } = data;

    // 1. Authenticate and get session token
    const { sessionToken } = await AuthenticationService.login(email, password);
    const user = await UserService.getUserDataByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    // Validate password (this is a placeholder, implement actual password validation)
    if (user.password !== password) {
        throw new Error("Invalid password");
    }

    const conversation_session = await SessionService.createSession({ userId: user.id });

    // 2. Set secure HTTP-only cookie
    (await cookies()).set('session_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict',
        maxAge: 60 * 60 * 4, // 4 hours expiration
        path: '/', // Accessible across all routes
    });

    return {
        conversation_session
    };
}