const { PrismaClient } = require("../../src/generated/prisma");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  console.log("This script will delete all conversations and their messages.");
  console.log("This action is irreversible.");

  rl.question("Are you sure you want to continue? (y/n) ", async (answer) => {
    if (answer.toLowerCase() === "y") {
      try {
        console.log("Fetching conversations...");
        const conversations = await prisma.conversation.findMany({
          include: {
            messages: true,
          },
        });

        if (conversations.length === 0) {
          console.log("No conversations found to delete.");
          return;
        }

        console.log(`Found ${conversations.length} conversations.`);

        for (const conversation of conversations) {
          console.log(
            `Deleting messages for conversation ${conversation.id}...`
          );
          await prisma.message.deleteMany({
            where: {
              conversationId: conversation.id,
            },
          });

          console.log(`Deleting conversation ${conversation.id}...`);
          await prisma.conversation.delete({
            where: {
              id: conversation.id,
            },
          });
        }

        console.log("All conversations and their messages have been deleted.");
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        await prisma.$disconnect();
        rl.close();
      }
    } else {
      console.log("Operation cancelled.");
      await prisma.$disconnect();
      rl.close();
    }
  });
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
