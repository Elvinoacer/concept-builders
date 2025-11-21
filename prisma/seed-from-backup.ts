import { PrismaClient } from '../src/generated/prisma/index.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const backupPath = path.join(__dirname, 'backup.json');
  const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

  // Seed Banners
  for (const banner of backupData.banners) {
    await prisma.banner.create({
      data: banner,
    });
  }

  // Seed Categories
  for (const category of backupData.categories) {
    await prisma.category.create({
      data: {
        ...category,
        designs: undefined, // Don't try to create designs here
      },
    });
  }

  // Seed Users
  for (const user of backupData.users) {
    await prisma.user.create({
      data: {
        ...user,
        accounts: { create: user.accounts },
        sessions: { create: user.sessions },
        orders: { create: user.orders },
        projects: { create: user.projects },
        reviews: { create: user.reviews },
        wishlist: { connect: user.wishlist.map((d: any) => ({ id: d.id })) }, // Assuming designs are already seeded
        folders: { create: user.folders },
        loginHistory: { create: user.loginHistory },
        notifications: { create: user.notifications },
        conversations: { create: user.conversations },
        sentMessages: { create: user.sentMessages },
        readMessages: { connect: user.readMessages.map((m: any) => ({ id: m.id })) }, // Assuming messages are already seeded
        feedback: { create: user.feedback },
        clientFeedback: { create: user.clientFeedback },
        adminFeedback: { create: user.adminFeedback },
        designViews: { create: user.designViews },
        cart: user.cart ? { create: { ...user.cart, items: { create: user.cart.items } } } : undefined,
        referredUsers: undefined, // Avoid circular dependencies
        referrer: undefined,
      },
    });
  }

  console.log('Seeding from backup completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
