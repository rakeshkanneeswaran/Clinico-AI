"use server";

import { DocumentService } from "@/data-core/services/document-service";
import { SessionService } from "@/data-core/services/session-service";
import { cookies, headers } from "next/headers";
import { AuthenticationService } from "@/data-core/services/authentication-service";
import { redirect } from "next/navigation";

interface SessionResponse {
    session: string;
}

export async function getSessions(): Promise<SessionResponse> {
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

    const isSessionValid = await AuthenticationService.authenicateSession(sessionToken);
    if (!isSessionValid) {
        redirect('/login');
    }

    return { session: sessionToken };
}

export async function getAllTemplates() {
    try {
        const { session } = await getSessions();
        const result = await DocumentService.getCustomDocumentBySession({ sessionId: session });
        console.log("Fetched templates:", result);
        return result;
    } catch (error) {
        // Check if this is a redirect error
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
            // Let the redirect propagate
            throw error;
        }

        console.error("Error in getAllTemplates:", error);
        throw new Error("Failed to fetch templates");
    }
}

export async function deleteTemplate({ templateId }: { templateId: string }) {
    return DocumentService.deleteCustomDocument({ templateId });
}

export async function getSpecificCustomDocumentForView({ templateId }: { templateId: string }) {
    try {
        const { session } = await getSessions();
        const result = await DocumentService.getSpecificCustomDocumentForView({ templateId });
        console.log("Fetched template:", result);
        return result;
    } catch (error) {
        // Check if this is a redirect error
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
            // Let the redirect propagate
            throw error;
        }

        console.error("Error in getSpecificCustomDocumentForView:", error);
        throw new Error("Failed to fetch template");
    }
}