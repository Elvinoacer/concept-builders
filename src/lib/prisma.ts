import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaPool: Pool | undefined;
}

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

const pool =
  global.prismaPool ||
  new Pool({
    connectionString: normalizedConnectionString,
  });

const prisma =
  global.prisma || new PrismaClient({ adapter: new PrismaPg(pool) });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
  global.prismaPool = pool;
}

export default prisma;
