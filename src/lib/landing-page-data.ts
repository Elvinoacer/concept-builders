import prisma from "./prisma";

export async function getLandingPageData() {
  const [
    newPlans,
    bestSellingPlans,
    featuredCategories,
    recentPosts,
    testimonials,
    featuredDesigns,
  ] = await Promise.all([
    prisma.design.findMany({
      orderBy: { createdAt: "desc" },
      take: 10, // Limit to 10 new plans
      select: {
        id: true,
        name: true,
        description: true,
        basePrice: true,
        architecturalPdfPrice: true,
        architecturalCadPrice: true,
        structuralPdfPrice: true,
        structuralCadPrice: true,
        billOfQuantitiesPrice: true,
        minBuildingCost: true,
        maxBuildingCost: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        floors: true,
        isFeatured: true,
        images: true,
        category: true,
        discounts: {
          include: {
            discount: true,
          },
        },
        orderItems: {
          select: { id: true },
        },
        architecturalDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        structuralDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        billOfQuantities: {
          include: {
            excelFiles: true,
          }
        }
      }
    }),
    prisma.design.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        basePrice: true,
        architecturalPdfPrice: true,
        architecturalCadPrice: true,
        structuralPdfPrice: true,
        structuralCadPrice: true,
        billOfQuantitiesPrice: true,
        minBuildingCost: true,
        maxBuildingCost: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        floors: true,
        isFeatured: true,
        images: true,
        category: true,
        discounts: {
          include: {
            discount: true,
          },
        },
        _count: { select: { orderItems: true } },
        architecturalDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        structuralDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        billOfQuantities: {
          include: {
            excelFiles: true,
          }
        }
      },
      orderBy: { orderItems: { _count: "desc" } },
      take: 3,
    }),
    prisma.category.findMany({
      where: { isFeatured: true },
      take: 4,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { designs: true },
        },
        designs: {
          take: 1,
          include: {
            images: {
              take: 1,
              where: { type: { in: ["IMAGE"] } }, // Prioritize image types
            },
          },
        },
      },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.testimonial.findMany({ take: 5 }),
    prisma.design.findMany({
      where: { isFeatured: true },
      take: 8,
      select: { 
        id: true,
        name: true,
        description: true,
        basePrice: true,
        architecturalPdfPrice: true,
        architecturalCadPrice: true,
        structuralPdfPrice: true,
        structuralCadPrice: true,
        billOfQuantitiesPrice: true,
        minBuildingCost: true,
        maxBuildingCost: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        floors: true,
        isFeatured: true,
        images: true,
        category: true,
        discounts: {
          include: {
            discount: true,
          },
        },
        orderItems: {
          select: { id: true },
        },
        architecturalDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        structuralDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        billOfQuantities: {
          include: {
            excelFiles: true,
          }
        }
      },
    }),
  ]);

  return {
    newPlans,
    bestSellingPlans,
    featuredCategories,
    recentPosts,
    testimonials,
    featuredDesigns,
  };
}
