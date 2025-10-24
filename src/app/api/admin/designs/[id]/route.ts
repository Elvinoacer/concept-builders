import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { isFeatured } = body; // Expecting a boolean

    if (typeof isFeatured !== 'boolean') {
      return NextResponse.json({ message: "isFeatured must be a boolean value" }, { status: 400 });
    }

    const updatedDesign = await prisma.design.update({
      where: { id },
      data: {
        isFeatured: isFeatured,
      },
    });

    return NextResponse.json(updatedDesign);
  } catch (error) {
    console.error("Error updating design featured status:", error);
    return NextResponse.json({ message: "Failed to update design featured status" }, { status: 500 });
  }
}
