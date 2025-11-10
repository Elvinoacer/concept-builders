const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const userId = 'cmht20d8y0000rqe19ym4jcia';

  // 1. Delete all existing orders for the user
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      items: true,
    },
  });

  for (const order of orders) {
    await prisma.orderItem.deleteMany({
      where: {
        orderId: order.id,
      },
    });
  }

  await prisma.order.deleteMany({
    where: {
      userId: userId,
    },
  });
  console.log(`Deleted existing orders for user ${userId}`);

  // 2. Find a design to add to the order
  const design = await prisma.design.findFirst({
    where: {
      name: {
        not: undefined,
      },
    },
    include: {
      packageOptions: true,
      architecturalDesign: {
        include: {
          pdfFiles: true,
          cadFiles: true,
        },
      },
      structuralDesign: {
        include: {
          pdfFiles: true,
          cadFiles: true,
        },
      },
      billOfQuantities: {
        include: {
          excelFiles: true,
        },
      },
    },
  });

  if (!design) {
    console.error('No designs found in the database. Please seed designs first.');
    return;
  }

  // 3. Simulate a realistic purchase
  const selectedFileTypes = design.packageOptions.map((option) => option.name);
  const selectedExtras = [
    { name: 'Extra', price: 10.0 },
    { name: 'Another Extra', price: 20.0 },
  ];

  // 4. Calculate the correct amount
  let amount = design.basePrice;
  for (const option of design.packageOptions) {
    amount += option.price;
  }
  for (const extra of selectedExtras) {
    amount += extra.price;
  }

  // 5. Create the order
  const order = await prisma.order.create({
    data: {
      userId: userId,
      status: 'PAID',
      amount: amount,
      paymentGateway: 'paypal',
      paymentId: `seed-payment-${Date.now()}`,
      items: {
        create: [
          {
            designId: design.id,
            quantity: 1,
            selectedFileTypes: selectedFileTypes,
            selectedExtras: selectedExtras,
          },
        ],
      },
    },
    include: {
      items: {
        include: {
          design: {
            include: {
              architecturalDesign: {
                include: {
                  pdfFiles: true,
                  cadFiles: true,
                },
              },
              structuralDesign: {
                include: {
                  pdfFiles: true,
                  cadFiles: true,
                },
              },
              billOfQuantities: {
                include: {
                  excelFiles: true,
                },
              },
            },
          },
        },
      },
    },
  });

  console.log('Successfully seeded purchase:', order);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });