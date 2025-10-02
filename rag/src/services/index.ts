import { OllamaEmbeddings } from "@langchain/ollama";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as dotenv from 'dotenv';
dotenv.config();

export class SupabaseService {
    private static embeddings = new OllamaEmbeddings({
        baseUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434',
        model: "nomic-embed-text",
    });

    private static supabaseClient: SupabaseClient = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_ANON_KEY || ''
    );

    /**
     * Store conversation in Supabase with embeddings
     */
    static async storeConversation(
        sessionId: string,
        transcript: string,
        chunkSize: number = 100,
        chunkOverlap: number = 30
    ): Promise<void> {
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize,
            chunkOverlap,
        });

        const chunks = await textSplitter.splitText(transcript);

        for (const chunk of chunks) {
            const embedding = await this.embeddings.embedQuery(chunk);

            const { error } = await this.supabaseClient
                .from('conversation_vectors')
                .insert({
                    session_id: sessionId,
                    content: chunk,
                    embedding
                });

            if (error) throw error;
        }
    }

    /**
     * Find similar conversations based on query embedding
     */
    static async findSimilarConversations(
        query: string,
        sessionId?: string,
        limit: number = 10
    ): Promise<{ status: string; data: string[] }> {
        const queryEmbedding = await this.embeddings.embedQuery(query);

        const { data, error } = await this.supabaseClient
            .rpc('match_conversations', {
                query_embedding: queryEmbedding,
                match_count: limit,
                filter_session_id: sessionId || null
            });

        if (error) throw error;

        const contents = data?.map((item: { content: string }) => item.content) || [];

        return {
            status: "success",
            data: contents
        };
    }

    /**
     * Delete existing vectors for session and recreate
     */
    static async deleteAndRecreateVectorStore(
        sessionId: string,
        transcript: string
    ): Promise<void> {
        const { error: deleteError } = await this.supabaseClient
            .from('conversation_vectors')
            .delete()
            .eq('session_id', sessionId);

        if (deleteError) throw deleteError;

        await this.storeConversation(sessionId, transcript);
    }

    static async deleteAllDataFromVectorStore(sessionId: string): Promise<void> {
        const { error } = await this.supabaseClient
            .from('conversation_vectors')
            .delete()
            .eq('session_id', sessionId);

        if (error) throw error;
    }

    /**
     * Clear all data from the vector store for a specific session
     */
    static async clearSessionData(sessionId: string): Promise<void> {
        await this.deleteAllDataFromVectorStore(sessionId);
    }
}
