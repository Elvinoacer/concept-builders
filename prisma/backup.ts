import { createPrismaClient } from './client';
import fs from 'fs';

const { prisma, pool } = createPrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
      sessions: true,
      orders: true,
      projects: true,
      reviews: true,
      wishlist: true,
      folders: true,
      loginHistory: true,
      notifications: true,
      conversations: true,
      sentMessages: true,
      readMessages: true,
      feedback: true,
      clientFeedback: true,
      adminFeedback: true,
      designViews: true,
      referredUsers: true,
      referrer: true,
      cart: {
        include: {
          items: true,
        },
      },
    },
  });

  const categories = await prisma.category.findMany({
    include: {
      designs: true,
    },
  });

  const banners = await prisma.banner.findMany();

  const backupData = {
    users,
    categories,
    banners,
  };

  fs.writeFileSync('prisma/backup.json', JSON.stringify(backupData, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
