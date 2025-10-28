import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const userFeedback = await prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(userFeedback);
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { rating, category, feedback } = body;

    if (!rating || !category || !feedback) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newFeedback = await prisma.feedback.create({
      data: {
        rating,
        category,
        feedback,
        userId,
      },
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
