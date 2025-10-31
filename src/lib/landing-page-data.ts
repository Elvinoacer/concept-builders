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
include: {
        images: true,
        files: true,
        category: true,
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
      include: {
        images: true,
        files: true,
        category: true,
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
    prisma.testimonial.findMany(),
    prisma.design.findMany({
      where: { isFeatured: true },
      take: 8,
      include: { 
        images: true,
        files: true, 
        category: true,
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
