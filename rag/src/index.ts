import { OllamaEmbeddings } from "@langchain/ollama";
import { createClient } from '@supabase/supabase-js';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as dotenv from 'dotenv';
dotenv.config();
import { SupabaseClient } from '@supabase/supabase-js';

const embeddings = new OllamaEmbeddings({
    baseUrl: "http://localhost:11434",
    model: "nomic-embed-text",
});


const supabaseClient = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);



// Custom function to store documents
export async function storeConversation(
    sessionId: string,
    transcript: string,
    chunkSize: number = 100,
    chunkOverlap: number = 30
) {
    // Create a text splitter
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
    });

    // Split the transcript into chunks
    const chunks = await textSplitter.splitText(transcript);

    // Process each chunk
    for (const chunk of chunks) {
        const embedding = await embeddings.embedQuery(chunk);

        const { error } = await supabaseClient
            .from('conversation_vectors')
            .insert({
                session_id: sessionId,
                content: chunk,
                embedding: embedding
            });

        if (error) throw error;
    }
}

export async function findSimilarConversations(
    query: string,
    sessionId?: string,
    limit: number = 3
) {
    const queryEmbedding = await embeddings.embedQuery(query);
    const { data, error } = await supabaseClient
        .rpc('match_conversations', {
            query_embedding: queryEmbedding,
            match_count: limit,
            filter_session_id: sessionId || null
        });

    if (error) throw error;

    // Extract only the content from each result
    const contents = data?.map((item: { content: string }) => item.content) || [];

    return {
        status: "success",
        data: contents
    }
}



export async function deleteAndRecreateVectorStore(sessionId: string, transcript: string) {
    // Delete existing vectors for this session
    const { error: deleteError } = await supabaseClient
        .from('conversation_vectors')
        .delete()
        .eq('session_id', sessionId);

    if (deleteError) throw deleteError;

    // Store new vectors
    await storeConversation(sessionId, transcript);
}