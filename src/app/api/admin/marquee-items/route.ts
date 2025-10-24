import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const marqueeItems = await prisma.marqueeItem.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(marqueeItems);
  } catch (error) {
    console.error("Error fetching marquee items:", error);
    return NextResponse.json({ message: "Failed to fetch marquee items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }

    const newMarqueeItem = await prisma.marqueeItem.create({
      data: {
        content,
      },
    });

    return NextResponse.json(newMarqueeItem, { status: 201 });
  } catch (error) {
    console.error("Error creating marquee item:", error);
    return NextResponse.json({ message: "Failed to create marquee item" }, { status: 500 });
  }
}
