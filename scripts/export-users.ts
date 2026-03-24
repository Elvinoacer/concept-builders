import fs from "fs";
import path from "path";
import { Prisma, PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const userScalarSelect = Object.values(Prisma.UserScalarFieldEnum).reduce(
  (select, field) => {
    select[field] = true;
    return select;
  },
  {} as Prisma.UserSelect,
);

function toJsonSafe(_key: string, value: unknown) {
  return typeof value === "bigint" ? value.toString() : value;
}

async function exportUsers(outputArg?: string) {
  const outputPath = path.resolve(outputArg ?? "prisma/users-export.json");

  const users = await prisma.user.findMany({
    select: userScalarSelect,
  });

  fs.writeFileSync(outputPath, JSON.stringify(users, toJsonSafe, 2), "utf-8");

  console.log(`Exported ${users.length} users to ${outputPath}`);
}

exportUsers(process.argv[2])
  .catch((error) => {
    console.error("Failed to export users:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
