import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function GET() {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const banners = await prisma.banner.findMany();
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { message: "Failed to fetch banners" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const body = await request.json();
    const { title, description, image } = body;

    if (!title || !description || !image) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newBanner = await prisma.banner.create({
      data: {
        title,
        description,
        image,
      },
    });

    revalidatePath("/");

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { message: "Failed to create banner" },
      { status: 500 },
    );
  }
}
