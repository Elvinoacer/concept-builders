const { PrismaClient } = require("../src/generated/prisma");
const { categoriesData, designsData } = require("./design-data");
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  await prisma.file.deleteMany({});
  await prisma.design.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.testimonial.deleteMany({}); // Clear existing testimonials
  await prisma.packageOption.deleteMany({}); // Clear existing package options

  for (const category of categoriesData) {
    await prisma.category.create({
      data: category,
    });
  }

  const categories = await prisma.category.findMany();

  for (const design of designsData) {
    const category = categories.find((c) => c.name === design.category);
    if (category) {
      const createdDesign = await prisma.design.create({
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
          // Files are created separately or linked via DesignDocuments
          // For now, we'll assume files are handled by DesignDocuments or not directly linked here
        },
      });

      // Create PackageOptions for the design
      if (design.packageOptions && design.packageOptions.length > 0) {
        for (const option of design.packageOptions) {
          await prisma.packageOption.create({
            data: {
              name: option.name,
              price: option.price,
              designId: createdDesign.id,
            },
          });
        }
      }
    }
  }

  const testimonialsData = [
    {
      id: uuidv4(),
      author: 'Alice Johnson',
      quote: 'Concept Builders turned our vision into a beautiful reality. Their attention to detail and professionalism were outstanding!',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      id: uuidv4(),
      author: 'Bob Williams',
      quote: 'We are incredibly happy with our new home. The designs were innovative and the construction quality was top-notch.',
      image: 'https://randomuser.me/api/portraits/men/70.jpg',
    },
    {
      id: uuidv4(),
      author: 'Charlie Brown',
      quote: 'From concept to completion, Concept Builders provided exceptional service. Highly recommend for anyone looking to build.',
      image: 'https://randomuser.me/api/portraits/men/71.jpg',
    },
    {
      id: uuidv4(),
      author: 'Diana Prince',
      quote: 'Our experience was seamless. The team was responsive, and the final product exceeded all our expectations.',
      image: 'https://randomuser.me/api/portraits/women/72.jpg',
    },
    {
      id: uuidv4(),
      author: 'Eve Adams',
      quote: 'The best decision we made was choosing Concept Builders. Their unique designs and commitment to sustainability are truly impressive.',
      image: 'https://randomuser.me/api/portraits/women/73.jpg',
    },
  ];

  for (const data of testimonialsData) {
    await prisma.testimonial.upsert({
      where: { id: data.id },
      update: { ...data },
      create: { ...data },
    });
  }
  console.log(`Seeded ${testimonialsData.length} testimonials.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });