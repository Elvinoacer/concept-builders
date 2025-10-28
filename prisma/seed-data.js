const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  console.log("deleting the projects...");
  const deleteProjects = await prisma.project.deleteMany();

  console.log("Seed data deleted successfully.", deleteProjects);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
