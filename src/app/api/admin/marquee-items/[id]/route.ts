import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 },
      );
    }

    const updatedMarqueeItem = await prisma.marqueeItem.update({
      where: { id },
      data: {
        content,
      },
    });

    revalidatePath("/");

    return NextResponse.json(updatedMarqueeItem);
  } catch (error) {
    console.error("Error updating marquee item:", error);
    return NextResponse.json(
      { message: "Failed to update marquee item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { id } = await params;

    await prisma.marqueeItem.delete({
      where: { id },
    });

    revalidatePath("/");

    return NextResponse.json(
      { message: "Marquee item deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting marquee item:", error);
    return NextResponse.json(
      { message: "Failed to delete marquee item" },
      { status: 500 },
    );
  }
}
