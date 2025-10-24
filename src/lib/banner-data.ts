import prisma from "./prisma";

export async function getBanners() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return banners;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}
