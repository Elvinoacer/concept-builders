import prisma from "@/lib/prisma";

async function main() {
  const modern = await prisma.category.findFirst({
    where: { name: "Modern" },
  });

  const luxury = await prisma.category.findFirst({
    where: { name: "Luxury" },
  });

  const smallPlot = await prisma.category.findFirst({
    where: { name: "Small Plot" },
  });

  await prisma.designCollection.createMany({
    data: [
      {
        title: "Top Modern House Designs",
        subtitle: "Trending · 2024/25",
        description:
          "A curated showcase of striking contemporary residential architecture — flat rooflines, expansive glazing, and the perfect play of solid and void.",
        image:
          "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives1.jpeg",
        categoryId: modern?.id,
        order: 1,
      },
      {
        title: "Best 4 Bedroom House Plans",
        subtitle: "Family Living · Plans",
        description:
          "Space, flow, and family life considered in every sq ft. Discover layouts engineered for how modern families actually live.",
        image:
          "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/4-Bedroom_L-Shaped_Bungalow_Front_Elevation1.jpg",
        order: 2,
      },
      {
        title: "Luxury Villa Design Trends",
        subtitle: "Premium · 2025 Trends",
        description:
          "Where architecture meets resort living. Pool pavilions, double-height volumes, and materials that age like wine — the anatomy of a modern villa.",
        image:
          "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa3.jpg",
        categoryId: luxury?.id,
        order: 3,
      },
      {
        title: "Small Plot Design Ideas",
        subtitle: "Smart Living · Urban",
        description:
          "Compact footprint, generous spirit. Discover how clever spatial planning, vertical living, and thoughtful landscaping unlock tight urban plots.",
        image:
          "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow1.jpg",
        categoryId: smallPlot?.id,
        order: 4,
      },
    ],
  });

  console.log("✅ DesignCollection records seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
