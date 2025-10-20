const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();

  if (user) {
    await prisma.notification.createMany({
      data: [
        {
          icon: "update",
          title: "Project Update",
          description: 'Your project "Modern Retreat" has been updated.',
          userId: user.id,
        },
        {
          icon: "new_releases",
          title: "New Design",
          description: 'New design "Coastal Breeze" is now available.',
          userId: user.id,
        },
        {
          icon: "redeem",
          title: "Referral Bonus",
          description: "Your referral bonus has been credited.",
          userId: user.id,
        },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
