import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid'; // Import uuid

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { fileUrl, fileType, originalFileName } = await request.json();
    const designId = params.id;

    if (!fileUrl || !fileType || !originalFileName) {
      return new NextResponse("Missing fileUrl, fileType, or originalFileName", { status: 400 });
    }

    const newFile = await prisma.file.create({
      data: {
        url: fileUrl,
        type: fileType,
        designId: designId,
        version: 1,
        isLatest: true,
        originalFileName: originalFileName,
        fileIdentifier: uuidv4(), // Generate a new fileIdentifier for the first version
      },
    });

    return NextResponse.json(newFile, { status: 200 });
  } catch (error) {
    console.error("Error updating design with file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
