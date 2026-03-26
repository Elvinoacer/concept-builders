import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [allDesignsCount, foldersCount, featuredCount, trendingCount] =
      await prisma.$transaction([
        prisma.design.count(),
        prisma.folder.count(),
        prisma.design.count({
          where: { isFeatured: true },
        }),
        prisma.design.count({
          where: { views: { gt: 0 } },
        }),
      ]);
    // There is no "archived" status in the schema, so we return 0 for now.
    const archivedCount = 0;

    const counts = {
      all: allDesignsCount,
      folders: foldersCount,
      featured: featuredCount,
      archived: archivedCount,
      trending: trendingCount,
    };

    return NextResponse.json(counts, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching tab counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch tab counts" },
      { status: 500 },
    );
  }
}
