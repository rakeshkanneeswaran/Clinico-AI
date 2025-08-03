
import { PrismaClient, DocumentType } from '@prisma/client';

const prisma = new PrismaClient();
export { prisma, DocumentType };