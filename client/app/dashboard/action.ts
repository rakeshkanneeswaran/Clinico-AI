"use server"


import { SessionService } from "@/data-core/services/session-service"
import { cookies, headers } from "next/headers";
import { AuthenticationService } from "@/data-core/services/authentication-service";
import { redirect } from "next/navigation";

export async function getSessions(): Promise<{ id: string; createdAt: Date; updatedAt: Date; patient: { id: string; name: string; age: string; weight: string; height: string; bloodType: string; gender: string; } | null }[]> {
    const heads = await headers();
    const ip =
        heads.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        heads.get("x-real-ip") ||
        "Unknown";

    console.log("Server Action IP:", ip);



    const sessionToken = (await cookies()).get('session_token')?.value;
    if (!sessionToken) {
        redirect('/login');
    }
    if (!sessionToken) {
        redirect('/login');
    }
    const isSessionValid = await AuthenticationService.authenicateSession(sessionToken);
    if (!isSessionValid) {
        redirect('/login');
    }
    const user = await AuthenticationService.getUserBySession(sessionToken)
    const session = await SessionService.getAllSessionByUserId({ userId: user.id });
    if (!user) {
        redirect('/login');
    }
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