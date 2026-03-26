import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { id } = await params;
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json(
        { message: "Banner not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { message: "Failed to fetch banner" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, image } = body;

    if (!title || !description || !image) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: {
        title,
        description,
        image,
      },
    });

    revalidatePath("/");

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { message: "Failed to update banner" },
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

    await prisma.banner.delete({
      where: { id },
    });

    revalidatePath("/");

    return NextResponse.json(
      { message: "Banner deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { message: "Failed to delete banner" },
      { status: 500 },
    );
  }
}
