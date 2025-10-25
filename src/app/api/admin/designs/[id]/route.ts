import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { isFeatured } = body; // Expecting a boolean

    if (typeof isFeatured !== "boolean") {
      return NextResponse.json(
        { message: "isFeatured must be a boolean value" },
        { status: 400 }
      );
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
    return NextResponse.json(
      { message: "Failed to update design featured status" },
      { status: 500 }
    );
  }
}

// write the delete method to delete a design by id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const deletedDesign = await prisma.design.delete({
      where: { id },
    });

    return NextResponse.json(deletedDesign);
  } catch (error) {
    console.error("Error deleting design:", error);
    return NextResponse.json(
      { message: "Failed to delete design" },
      { status: 500 }
    );
  }
}
