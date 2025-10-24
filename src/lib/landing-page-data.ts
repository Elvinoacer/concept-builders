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
      take: 8,
      include: { files: true, category: true },
    }),
    prisma.design.findMany({
      include: {
        files: true,
        category: true,
        _count: { select: { orderItems: true } },
      },
      orderBy: { orderItems: { _count: "desc" } },
      take: 3,
    }),
    prisma.category.findMany({
      where: { isFeatured: true },
      take: 4,
      orderBy: { name: "asc" },
      include: {
        designs: {
          take: 1,
          include: {
            files: {
              take: 1,
              where: { type: { in: ["IMAGE", "FLOOR_PLAN"] } }, // Prioritize image types
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
      include: { files: true, category: true },
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
