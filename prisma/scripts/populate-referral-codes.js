const { PrismaClient } = require("../../src/generated/prisma");
const { v4: uuidv4 } = require("uuid");

const db = new PrismaClient();

async function main() {
  const usersWithoutReferralCode = await db.user.findMany({
    where: {
      referralCode: null,
    },
  });

  console.log(
    `Found ${usersWithoutReferralCode.length} users without referral codes.`
  );

  for (const user of usersWithoutReferralCode) {
    const newReferralCode = uuidv4();
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        referralCode: newReferralCode,
      },
    });
    console.log(`Assigned referral code ${newReferralCode} to user ${user.id}`);
  }

  console.log("Referral code population complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
