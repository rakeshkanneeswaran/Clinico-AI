"use server"


import { SessionService } from "@/data-core/services/session-service"
import { cookies, headers } from "next/headers";
import { AuthenticationService } from "@/data-core/services/authentication-service";
import { redirect } from "next/navigation";
import { DocumentService } from "@/data-core/services/document-service";


export interface Template {
    name: string;
    description: string;
    fields: DocumentField[];
}

interface DocumentField {
    name: string;
    label: string;
    description: string;
}


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

export async function createTemplate(templateData: {
    sessionId: string;
    Template: Template;
}) {
    const sessionToken = (await cookies()).get('session_token')?.value;
    if (!sessionToken) {
        redirect('/login');
    }
    const isSessionValid = await AuthenticationService.authenicateSession(sessionToken);
    if (!isSessionValid) {
        redirect('/login');
    }
    const user = await AuthenticationService.getUserBySession(sessionToken)
    if (!user) {
        redirect('/login');
    }
    const result = await DocumentService.createTemplate({ userId: user.id, Template: templateData.Template });
    return result;
}

