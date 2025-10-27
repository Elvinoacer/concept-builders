import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const featuredFeedback = await prisma.feedback.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Limit to 5 featured feedbacks
    });

    return NextResponse.json(featuredFeedback);
  } catch (error) {
    console.error("Error fetching featured feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
