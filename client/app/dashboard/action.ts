"use server"

import { SessionService } from "@/data-core/services/session-service"
import { cookies } from "next/headers";
import { AuthenticationService } from "@/data-core/services/authentication-service";

export async function getSessions(): Promise<{ id: string; createdAt: Date; updatedAt: Date; patient: { id: string; name: string; age: string; weight: string; height: string; bloodType: string; gender: string; } | null }[]> {
    const sessionToken = (await cookies()).get('session_token')?.value;
    if (!sessionToken) {
        throw new Error("Session token not found");
    }
    const user = await AuthenticationService.getUserBySession(sessionToken)
    const session = await SessionService.getAllSessionByUserId({ userId: user.id });
    if (session === null) {
        return [];
    }
    return session;
}

export async function deleteSession(sessionId: string): Promise<{ success: boolean; sessionId: string }> {
    if (!sessionId) {
        throw new Error("Session ID not provided");
    }

    const result = await SessionService.deleteSession({ sessionId });
    return {
        success: result.success,
        sessionId: result.sessionId
    };
}