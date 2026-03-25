import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("isFeatured") === "true";

    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(isFeatured ? { isFeatured: true } : {}),
    };

    const total = await prisma.design.count({ where });

    return NextResponse.json(
      { total },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching design count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
