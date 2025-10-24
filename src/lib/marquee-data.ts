import prisma from "./prisma";

export async function getMarqueeItems() {
  try {
    const marqueeItems = await prisma.marqueeItem.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return marqueeItems;
  } catch (error) {
    console.error("Error fetching marquee items:", error);
    return [];
  }
}
