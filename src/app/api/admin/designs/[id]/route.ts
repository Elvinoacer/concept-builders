import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const canManageDesigns =
      session?.user?.role === "ADMIN" || session?.user?.role === "TEAM";

    if (!canManageDesigns) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isFeatured, featuredPriority } = body;

    const dataToUpdate: any = {};
    if (typeof isFeatured === "boolean") {
      dataToUpdate.isFeatured = isFeatured;
    }
    if (typeof featuredPriority === "number") {
      dataToUpdate.featuredPriority = featuredPriority;
    }

    const updatedDesign = await prisma.design.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedDesign);
  } catch (error) {
    console.error("Error updating design featured status:", error);
    return NextResponse.json(
      { message: "Failed to update design featured status" },
      { status: 500 },
    );
  }
}

// write the delete method to delete a design by id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const canManageDesigns =
      session?.user?.role === "ADMIN" || session?.user?.role === "TEAM";

    if (!canManageDesigns) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const deletedDesign = await prisma.design.delete({
      where: { id },
    });

    return NextResponse.json(deletedDesign);
  } catch (error) {
    console.error("Error deleting design:", error);
    return NextResponse.json(
      { message: "Failed to delete design" },
      { status: 500 },
    );
  }
}
