import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const normalizePostgresSslMode = (rawConnectionString: string) => {
    try {
      const parsedUrl = new URL(rawConnectionString);
      const sslMode = parsedUrl.searchParams.get("sslmode");

      if (
        !sslMode ||
        sslMode === "prefer" ||
        sslMode === "require" ||
        sslMode === "verify-ca"
      ) {
        parsedUrl.searchParams.set("sslmode", "verify-full");
      }

      return parsedUrl.toString();
    } catch {
      return rawConnectionString;
    }
  };

  const normalizedConnectionString = normalizePostgresSslMode(connectionString);

  const pool = new Pool({ connectionString: normalizedConnectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  return { prisma, pool };
}
