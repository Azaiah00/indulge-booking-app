// Load .env so DATABASE_URL is set when this module runs (e.g. in API routes).
import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prisma 7 requires a driver adapter; use DATABASE_URL from .env
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString || !connectionString.startsWith("postgresql://")) {
    throw new Error(
      "DATABASE_URL is missing or invalid in .env. It must be a postgresql:// URL (e.g. from Neon)."
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
