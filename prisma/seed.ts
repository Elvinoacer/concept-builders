import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const categoriesData = [
  {
    name: "Bungalows",
    image: "https://www.karmod.com/media/page2/Prefab-Bungalows.jpg",
  },
  {
    name: "Duplexes",
    image:
      "https://res.akamaized.net/domain/image/upload/t_web/c_fill,w_720,h_480/v1564363376/2015392229_1_1_190621_050142-w1920-h1280_ihnkgz.jpg",
  },
  {
    name: "Apartments",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/564730784.jpg?k=62d1662f0d9c9c35b55c38772bc26b0e295894082a5b4b8a69f790c4991286a9&o=&hp=1",
  },
  {
    name: "Modern",
    image:
      "https://i0.wp.com/integrum.co.ke/wp-content/uploads/2025/07/best-home-design-in-Kenya-for-country-houses-1-scaled.webp?fit=1024%2C768&ssl=1",
  },
  {
    name: "Traditional",
    image: "https://newtrad.org/wp-content/uploads/2018/10/balt.jpg",
  },
  {
    name: "Luxury",
    image:
      "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/izdcG.gHez5Y/v1/-1x-1.webp",
  },
];

const designsData = [
  {
    name: "Modern Minimalist Home",
    category: "Modern",
    description:
      "A beautiful and spacious modern home with a minimalist design.",
    images: [{ url: "/images/banner-1.png", type: "main" }],
    basePrice: 999,
    priceRange: "$999 - $4999",
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    floors: 2,
    salesCount: 100,
  },
  {
    name: "Cozy Cottage",
    category: "Traditional",
    description:
      "A charming cottage perfect for a small family or as a vacation home.",
    images: [{ url: "/images/banner-2.png", type: "main" }],
    basePrice: 799,
    priceRange: "$799 - $3999",
    bedrooms: 2,
    bathrooms: 1,
    area: 1500,
    floors: 1,
    salesCount: 150,
  },
  {
    name: "Luxury Villa",
    category: "Luxury",
    description:
      "An expansive and luxurious villa with all the modern amenities.",
    images: [{ url: "/images/banner-3.png", type: "main" }],
    basePrice: 1999,
    priceRange: "$1999 - $9999",
    bedrooms: 5,
    bathrooms: 4,
    area: 5000,
    floors: 2,
    salesCount: 50,
  },
];

const testimonialsData = [
  {
    author: "John Doe",
    quote:
      "Concept Builders made our dream home a reality. The process was seamless and the team was a pleasure to work with.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    author: "Jane Smith",
    quote:
      "The attention to detail and commitment to quality is what sets Concept Builders apart. I highly recommend them.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    author: "Peter Jones",
    quote:
      "I was impressed with the level of professionalism and expertise. The final result exceeded my expectations.",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
];

const postsData = [
  {
    title: "The Future of Sustainable Home Design",
    excerpt: "Sustainable home design is not just a trend; it's a necessity for our future.",
    content: `...`,
    image: "https://www.okdecoracion.com/wp-content/uploads/2024/12/eco-friendly-home-design.jpeg",
    author: "Ethan Harper",
  },
  {
    title: "Top 5 Modern House Plans for 2024",
    excerpt: "Modern architecture is constantly evolving, and 2024 is no exception.",
    content: `...`,
    image: "https://i.pinimg.com/736x/da/11/f4/da11f45b1aec027598af3c55de5f4fd5.jpg",
    author: "Olivia Bennett",
  },
];

async function main() {
  await prisma.design.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.post.deleteMany({});

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
          images: design.images,
          basePrice: design.basePrice,
          priceRange: design.priceRange,
          categoryId: category.id,
          bedrooms: design.bedrooms,
          bathrooms: design.bathrooms,
          area: design.area,
          floors: design.floors,
          salesCount: design.salesCount,
          renderings: [],
          planDetails: [],
          faqs: [],
          buildingCostEstimates: [],
          tags: [],
          fileTypes: [],
          drawingSetsOptions: [],
        },
      });
    }
  }

  for (const testimonial of testimonialsData) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }

  for (const post of postsData) {
    await prisma.post.create({
      data: post,
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