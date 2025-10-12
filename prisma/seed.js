const { PrismaClient } = require("../src/generated/prisma");
const { categoriesData, designsData } = require("./seed-data");

const prisma = new PrismaClient();

async function main() {
  await prisma.file.deleteMany({});
  await prisma.design.deleteMany({});
  await prisma.category.deleteMany({});

  for (const category of categoriesData) {
    await prisma.category.create({
      data: category,
    });
  }

  const categories = await prisma.category.findMany();

  for (const design of designsData) {
    const category = categories.find((c) => c.name === design.category);
    if (category) {
      await prisma.design.create({
        data: {
          name: design.name,
          description: design.description,
          basePrice: design.basePrice,
          priceRange: design.priceRange,
          categoryId: category.id,
          bedrooms: design.bedrooms,
          bathrooms: design.bathrooms,
          area: design.area,
          floors: design.floors,
          planDetails: design.planDetails,
          files: {
            create: design.files.map((file) => ({ ...file, type: file.type })),
          },
        },
      });
    }
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
