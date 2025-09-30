import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { folderId: string } }) {
  try {
    const { folderId } = params;

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
