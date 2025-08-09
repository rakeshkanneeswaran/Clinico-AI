import fastify from 'fastify';
import { OllamaEmbeddings } from "@langchain/ollama";
import { createClient } from '@supabase/supabase-js';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as dotenv from 'dotenv';
import { deleteAndRecreateVectorStore, storeConversation, findSimilarConversations } from '.';

dotenv.config();

// Initialize Fastify
const app = fastify({ logger: true });

// Initialize embeddings and Supabase client
const embeddings = new OllamaEmbeddings({
    baseUrl: "http://localhost:11434",
    model: "nomic-embed-text",
});

const supabaseClient = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);



// Routes
app.post('/api/create/vectorestore/', async (request, reply) => {
    try {
        const { sessionId, transcript } = request.body as { sessionId: string; transcript: string };
        await storeConversation(sessionId, transcript);
        return { status: 'success', message: 'Vector store created successfully' };
    } catch (error) {
        app.log.error(error);
        reply.status(500).send({ status: 'error', message: 'Failed to create vector store' });
    }
});

app.post('/api/similarity-search/', async (request, reply) => {
    try {
        const { sessionId, query } = request.body as { sessionId?: string; query: string };
        const results = await findSimilarConversations(query, sessionId);
        return results
    } catch (error) {
        app.log.error(error);
        reply.status(500).send({ status: 'error', message: 'Failed to perform similarity search' });
    }
});

app.post('/api/delete-and-recreate-vectorstore/', async (request, reply) => {
    try {
        const { sessionId, transcript } = request.body as { sessionId: string; transcript: string };
        await deleteAndRecreateVectorStore(sessionId, transcript);
        return { status: 'success', message: 'Vector store recreated successfully' };
    } catch (error) {
        app.log.error(error);
        reply.status(500).send({ status: 'error', message: 'Failed to recreate vector store' });
    }
});

// Start server
const start = async () => {
    try {
        await app.listen({ port: 3001, host: '0.0.0.0' });
        console.log('Server running on http://localhost:3001');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();