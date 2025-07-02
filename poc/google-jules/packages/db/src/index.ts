import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// Re-export all Prisma types if needed by other packages
// This avoids direct dependency on '@prisma/client' in other packages for types
export * from '@prisma/client';
