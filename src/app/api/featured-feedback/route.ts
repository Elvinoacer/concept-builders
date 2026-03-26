import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const featuredFeedback = await prisma.feedback.findMany({
      where: {
        isFeatured: true,
      },
      select: {
        id: true,
        name: true,
        message: true,
        rating: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json(featuredFeedback, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching featured feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
