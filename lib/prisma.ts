import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

// @ts-ignore - Handle query logging
if (typeof prisma.$on === 'function') {
  (prisma as any).$on('query', (e: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Query: ' + e.query);
      console.log('Params: ' + e.params);
      console.log('Duration: ' + e.duration + 'ms');
    }
  });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
