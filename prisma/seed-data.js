const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  // Create or find a category
  let modernCategory = await prisma.category.findFirst();
  if (!modernCategory) {
    modernCategory = await prisma.category.create({
      data: {
        name: "Modern Home",
        image:
          "https://coralhomes.com.au/wp-content/uploads/Atlanta-Series.png",
        isFeatured: true,
      },
    });
    console.log(`Created category: ${modernCategory.name}`);
  } else {
    console.log(`Found existing category: ${modernCategory.name}`);
  }

  // Create a design with all fields populated
  const design = await prisma.design.create({
    data: {
      name: "The Grand Modern Villa",
      description:
        "A luxurious and spacious modern villa with cutting-edge design and smart home features.",
      basePrice: 750000.0,
      priceRange: "$750,000 - $1,200,000",
      bedrooms: 5,
      bathrooms: 4,
      area: 4500.0,
      floors: 2,
      planDetails: [
        "5 Bedrooms",
        "4 Bathrooms",
        "Open-plan living area",
        "Smart home integration",
        "Large garden",
        "Two-car garage",
      ],
      pdfPrice: 50.0,
      cadPrice: 200.0,
      pdfAndCadPrice: 220.0,
      dynamicUnitPricingOptions: {
        options: [
          {
            id: "dupo-1",
            name: "Garage",
            unit: "per unit",
            price: 25000,
            defaultQuantity: 1,
          },
          {
            id: "dupo-2",
            name: "Balcony",
            unit: "per sqft",
            price: 150,
            defaultQuantity: 50,
          },
          {
            id: "dupo-3",
            name: "Extra Bedroom",
            unit: "per unit",
            price: 15000,
            defaultQuantity: 0,
          },
        ],
      },
      minBuildingCost: 1500000.0,
      maxBuildingCost: 2500000.0,
      buildingCostEstimates: [
        {
          tier: "basic",
          description: "Standard finishes with quality materials.",
          costBreakdown: [
            { item: "Foundation", cost: 150000 },
            { item: "Framing", cost: 200000 },
            { item: "Roofing", cost: 75000 },
            { item: "Exterior Finishes", cost: 120000 },
            { item: "Interior Finishes", cost: 180000 },
            { item: "MEP", cost: 100000 },
            { item: "Fixtures", cost: 50000 },
          ],
        },
        {
          tier: "luxury",
          description:
            "High-end finishes, custom features, and premium materials.",
          costBreakdown: [
            { item: "Foundation", cost: 180000 },
            { item: "Framing", cost: 250000 },
            { item: "Roofing", cost: 90000 },
            { item: "Exterior Finishes", cost: 180000 },
            { item: "Interior Finishes", cost: 250000 },
            { item: "MEP", cost: 150000 },
            { item: "Fixtures", cost: 80000 },
          ],
        },
      ],
      calculatorOptions: {
        options: [
          { name: "Swimming Pool", price: 80000 },
          { name: "Outdoor Kitchen", price: 30000 },
          { name: "Smart Home System Upgrade", price: 20000 },
        ],
      },
      faq: [
        {
          question: "What is included in the base price?",
          answer:
            "The base price includes the architectural plans in PDF format.",
        },
        {
          question: "Can I customize the design?",
          answer:
            "Yes, customization options are available through our custom design request form.",
        },
      ],
      categoryId: modernCategory.id,
      isFeatured: true,
      views: 1200,
      files: {
        create: [
          {
            url: "https://example.com/grand-villa-floorplan.pdf",
            type: "PDF",
            originalFileName: "grand-villa-floorplan.pdf",
          },
          {
            url: "https://example.com/grand-villa-cad.dwg",
            type: "CAD",
            originalFileName: "grand-villa-cad.dwg",
          },
          {
            url: "https://example.com/grand-villa-render1.jpg",
            type: "IMAGE",
            originalFileName: "grand-villa-render1.jpg",
          },
          {
            url: "https://example.com/grand-villa-floorplan-image.jpg",
            type: "FLOOR_PLAN",
            originalFileName: "grand-villa-floorplan-image.jpg",
          },
        ],
      },
    },
  });
  console.log(`Created design with ID: ${design.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
