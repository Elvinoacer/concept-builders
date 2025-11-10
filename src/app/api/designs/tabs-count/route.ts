
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const allDesignsCount = await prisma.design.count();
    const foldersCount = await prisma.folder.count();
    const featuredCount = await prisma.design.count({
      where: { isFeatured: true },
    });
    const trendingCount = await prisma.design.count({
      where: { views: { gt: 0 } },
    });
    // There is no "archived" status in the schema, so we return 0 for now.
    const archivedCount = 0;

    const counts = {
      all: allDesignsCount,
      folders: foldersCount,
      featured: featuredCount,
      archived: archivedCount,
      trending: trendingCount,
    };

    return NextResponse.json(counts);
  } catch (error) {
    console.error("Error fetching tab counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch tab counts" },
      { status: 500 }
    );
  }
}
