import { c } from "node_modules/framer-motion/dist/types.d-Cjd591yU";

export class RAGService {
    static async storeConversation(transcript: string, sessionId: string): Promise<{ status: string; message: string }> {
        const response = await fetch(`${process.env.RAG_API_URL}/api/delete-and-recreate-vectorstore/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript, sessionId }),
        });
        const data = await response.json() as { status: string; message: string };
        return { status: data.status, message: data.message };
    }

    static async askQuestion(query: string, sessionId?: string): Promise<{ status: string; answer: string }> {
        // First call to similarity search
        const response = await fetch(`${process.env.RAG_API_URL}/api/similarity-search/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, sessionId }),
        });

        const data = await response.json() as { status: string; data: string[] };
        const contexts = data.data;
        console.log("[INFO] 🧠 Contexts retrieved:", contexts);

        // Second call to generate answer
        const response2 = await fetch(`${process.env.AI_URL}/api/generate-answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                contexts: contexts
            }),
        });

        const result = await response2.json() as { status: string; answer: string };
        return result;
    }

}