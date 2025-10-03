"use server";
import { DocumentService } from "@/data-core/services/document-service";
import { SessionService } from "@/data-core/services/session-service";
import { PatientService } from "@/data-core/services/patient-service";
import { TranscriptService } from "@/data-core/services/transcript-service";
import { RAGService } from "@/data-core/services/rag-service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthenticationService } from "@/data-core/services/authentication-service";



// Helper function for session validation
async function validateSession() {
    const sessionToken = (await cookies()).get('session_token')?.value;
    if (!sessionToken) {
        redirect('/login');
    }
    const user = await AuthenticationService.getUserBySession(sessionToken);
    if (!user) {
        redirect('/login');
    }
    return user;
}


export async function transcribeAudio(file: File) {
    const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY!;
    console.log("ASSEMBLYAI_API_KEY:", ASSEMBLYAI_API_KEY); // Debugging line

    try {
        // 1️⃣ Upload to AssemblyAI
        const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
            method: "POST",
            headers: {
                authorization: ASSEMBLYAI_API_KEY,
            },
            body: file,
        });

        const uploadData = await uploadResponse.json();
        if (!uploadData.upload_url) {
            throw new Error("Failed to upload audio to AssemblyAI");
        }

        // 2️⃣ Create transcription
        const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
            method: "POST",
            headers: {
                authorization: ASSEMBLYAI_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                audio_url: uploadData.upload_url,
                speech_model: "universal",
            }),
        });

        const transcriptData = await transcriptResponse.json();
        if (!transcriptData.id) throw new Error("Failed to create transcription job");

        // 3️⃣ Poll for completion
        let text: string | null = null;
        while (true) {
            const pollingResponse = await fetch(
                `https://api.assemblyai.com/v2/transcript/${transcriptData.id}`,
                {
                    headers: { authorization: ASSEMBLYAI_API_KEY },
                }
            );
            const pollingData = await pollingResponse.json();

            if (pollingData.status === "completed") {
                text = pollingData.text;
                break;
            }
            if (pollingData.status === "error") {
                throw new Error(pollingData.error);
            }

            await new Promise((r) => setTimeout(r, 3000));
        }

        return { success: true, text };
    } catch (error) {
        console.error("Transcription failed:", error);
        return { success: false, error: "Error transcribing audio." };
    }
}



export async function generateTranscription(s3FileName: string, sessionId: string): Promise<{ s3_file_name: string; transcript: string; message: string }> {
    await validateSession();

    if (!s3FileName) {
        throw new Error("No S3 file name provided");
    }

    const response = await DocumentService.generateTranscription({ s3_file_path: s3FileName, session_id: sessionId });
    return response;
}




export async function getTranscriptBySession({ sessionId }: { sessionId: string }): Promise<string | null> {
    await validateSession();

    if (!sessionId) {
        throw new Error("Session ID not provided");
    }
    const response = await DocumentService.getTranscriptBySession({ sessionId });
    return response ? response.content : null;
}

export async function createSession(): Promise<string> {
    const user = await validateSession();
    const session = await SessionService.createSession({ userId: user.id });
    return session.sessionId;
}

export async function createPatient(data: {
    name: string;
    age: string;
    gender: string;
    weight: string;
    height: string;
    bloodType: string;
    sessionId: string;
}): Promise<string> {
    await validateSession();

    if (!data.name || !data.age || !data.gender || !data.weight || !data.height || !data.bloodType || !data.sessionId) {
        throw new Error("All fields are required");
    }

    const patient = await PatientService.createPatient(data);
    return patient.id;
}

export async function getPatientBySession(sessionId: string): Promise<{ id: string; name: string; age: string; gender: string; weight: string; height: string; bloodType: string }> {
    await validateSession();

    if (!sessionId) {
        throw new Error("Session ID not provided");
    }

    const patient = await PatientService.getPatientBySessionId(sessionId);
    return patient;
}

export async function saveTranscript(sessionId: string, content: string) {
    await validateSession();

    try {
        const result = await TranscriptService.updateTranscript({ sessionId, content });
        const response = await RAGService.storeConversation(content, sessionId);
        if (response.status !== 'success') {
            throw new Error(response.message || "Failed to save transcript");
        }
        return result.success;
    } catch (error) {
        console.error("Error saving transcript:", error);
        throw new Error("Failed to save transcript");
    }
}

export async function storeConversation(transcript: string, sessionId: string) {
    await validateSession();
    return RAGService.storeConversation(transcript, sessionId);
}

export async function askQuestion(query: string, sessionId: string): Promise<{ status: string; answer: string }> {
    await validateSession();

    if (!query) {
        throw new Error("Query not provided");
    }
    const response = await RAGService.askQuestion(query, sessionId);
    return response;
}



export async function getSessionDocumentById({ sessionId, sessionDocumentId }: {
    sessionId: string;
    sessionDocumentId: string;
}) {
    await validateSession();

    if (!sessionDocumentId) {
        throw new Error("Document ID not provided");
    }
    const document = await DocumentService.getSessionDocumentById({ sessionDocumentId, sessionId });
    if (!document) {
        throw new Error("Document not found");
    }
    return document;
}


export async function generateDocument({ transcript, userTemplateId, sessionId, doctor_suggestions }: {
    transcript: string;
    userTemplateId: string;
    sessionId: string;
    doctor_suggestions: string;
}) {
    if (!transcript) {
        throw new Error("Transcription or document type not provided");
    }
    const response = await DocumentService.generateSessionDocument({
        transcript,
        userTemplateId,
        sessionId,
        doctor_suggestions: doctor_suggestions
    });
    return response;
}

export async function saveDocument({ sessionId, sessionDocumentId, content, userTemplateId }: {
    sessionId: string;
    sessionDocumentId: string;
    content: string;
    userTemplateId: string;
}) {
    await validateSession();

    if (!sessionId || !sessionDocumentId || !content) {
        throw new Error("Session ID, Document ID, and content are required");
    }

    const result = await DocumentService.saveSessionDocument({ sessionId, content, sessionDocumentId, userTemplateId });
    return result;
}

export async function getAllUserTemplates({ sessionId }: { sessionId: string; }) {


    const response = await DocumentService.getAllUserTemplates({ sessionId });
    return response;
}


export async function getAllSesssionDocuments({ sessionId }: { sessionId: string; }) {
    await validateSession();

    if (!sessionId) {
        throw new Error("Session ID is required");
    }

    const documents = await DocumentService.getAllSessionDocuments({ sessionId });
    return documents;
}
