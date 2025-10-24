const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

async function main() {
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
      where: { id: data.id }, // Use generated id as a unique identifier for upsert
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
