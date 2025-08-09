"use server"

import { SessionService } from "@/data-core/services/session-service"

export async function getSessions(userId: string): Promise<{ id: string; createdAt: Date; updatedAt: Date; patient: { id: string; name: string; age: string; weight: string; height: string; bloodType: string; gender: string; } | null }[]> {
    if (!userId) {
        throw new Error("User ID not provided");
    }

    const session = await SessionService.getAllSessionByUserId({ userId });
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