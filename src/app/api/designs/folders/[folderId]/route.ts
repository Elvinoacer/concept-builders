
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    const { folderId } = await params;

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { designs: true },
    });

    if (!folder) {
      return new NextResponse("Folder not found", { status: 404 });
    }

    return NextResponse.json(folder, { status: 200 });
  } catch (error) {
    console.error("Error fetching folder:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { folderId } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Missing folder name", { status: 400 });
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: folderId },
      data: { name },
    });

    return NextResponse.json(updatedFolder, { status: 200 });
  } catch (error) {
    console.error("Error updating folder:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
