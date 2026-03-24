import fs from "fs";
import path from "path";
import { createPrismaClient } from "./client";
import { Role, UserStatus } from "../src/generated/prisma/client";

type UserSeedRecord = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  role: Role;
  hashedPassword: string | null;
  status: UserStatus;
  impersonatingUserId: string | null;
  referralSource: string | null;
  createdAt: string;
  updatedAt: string;
  emailVerificationExpires: string | null;
  emailVerificationToken: string | null;
  passwordResetExpires: string | null;
  passwordResetToken: string | null;
  referralBonus: number;
  referralBonusConverted: number;
  referralCode: string;
  referredByCode: string | null;
  bio: string | null;
  adminRole: string | null;
  phone: string | null;
};

function toDate(value: string | null) {
  return value ? new Date(value) : null;
}

async function main() {
  const { prisma, pool } = createPrismaClient();

  try {
    const filePath = path.resolve("docs/api/users.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const users = JSON.parse(raw) as UserSeedRecord[];

    let created = 0;
    let updated = 0;

    for (const user of users) {
      const existing = await prisma.user.findUnique({ where: { id: user.id } });

      await prisma.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: toDate(user.emailVerified),
          image: user.image,
          role: user.role,
          hashedPassword: user.hashedPassword,
          status: user.status,
          impersonatingUserId: user.impersonatingUserId,
          referralSource: user.referralSource,
          createdAt: new Date(user.createdAt),
          emailVerificationExpires: toDate(user.emailVerificationExpires),
          emailVerificationToken: user.emailVerificationToken,
          passwordResetExpires: toDate(user.passwordResetExpires),
          passwordResetToken: user.passwordResetToken,
          referralBonus: user.referralBonus,
          referralBonusConverted: user.referralBonusConverted,
          referralCode: user.referralCode,
          referredByCode: user.referredByCode,
          bio: user.bio,
          adminRole: user.adminRole,
          phone: user.phone,
        },
        update: {
          name: user.name,
          email: user.email,
          emailVerified: toDate(user.emailVerified),
          image: user.image,
          role: user.role,
          hashedPassword: user.hashedPassword,
          status: user.status,
          impersonatingUserId: user.impersonatingUserId,
          referralSource: user.referralSource,
          emailVerificationExpires: toDate(user.emailVerificationExpires),
          emailVerificationToken: user.emailVerificationToken,
          passwordResetExpires: toDate(user.passwordResetExpires),
          passwordResetToken: user.passwordResetToken,
          referralBonus: user.referralBonus,
          referralBonusConverted: user.referralBonusConverted,
          referralCode: user.referralCode,
          referredByCode: user.referredByCode,
          bio: user.bio,
          adminRole: user.adminRole,
          phone: user.phone,
        },
      });

      if (existing) {
        updated += 1;
      } else {
        created += 1;
      }
    }

    console.log(
      `Users seed completed. Total: ${users.length}, Created: ${created}, Updated: ${updated}`,
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Failed to seed users:", error);
  process.exit(1);
});
