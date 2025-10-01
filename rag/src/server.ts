import fastify from 'fastify';
import * as dotenv from 'dotenv';
import { SupabaseService } from './services';

dotenv.config();

const app = fastify({ logger: true });

// Routes
app.post('/api/create/vectorstore/', async (request, reply) => {
    try {
        const { sessionId, transcript } = request.body as { sessionId: string; transcript: string };
        await SupabaseService.storeConversation(sessionId, transcript);
        return { status: 'success', message: 'Vector store created successfully' };
    } catch (error) {
        app.log.error(error);
        reply.status(500).send({ status: 'error', message: 'Failed to create vector store' });
    }
});

app.post('/api/similarity-search/', async (request, reply) => {
    try {
        const { sessionId, query } = request.body as { sessionId: string; query: string };
        const results = await SupabaseService.findSimilarConversations(query, sessionId);
        return results;
    } catch (error) {
        app.log.error(error);
        reply.status(500).send({ status: 'error', message: 'Failed to perform similarity search' });
    }
});

app.post('/api/delete-and-recreate-vectorstore/', async (request, reply) => {
    try {
        const { sessionId, transcript } = request.body as { sessionId: string; transcript: string };
        await SupabaseService.deleteAndRecreateVectorStore(sessionId, transcript);
        return { status: 'success', message: 'Vector store recreated successfully' };
    } catch (error) {
        app.log.error(error);
        reply.status(500).send({ status: 'error', message: 'Failed to recreate vector store' });
    }
});

app.post('/api/delete-all-data-from-vectorstore/', async (request, reply) => {
    try {
        const { sessionId } = request.body as { sessionId: string };
        await SupabaseService.deleteAllDataFromVectorStore(sessionId);
        return { status: 'success', message: 'All data deleted from vector store' };
    } catch (error) {
        app.log.error(error);
        reply.status(500).send({ status: 'error', message: 'Failed to delete data from vector store' });
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
