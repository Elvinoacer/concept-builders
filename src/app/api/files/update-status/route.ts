import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UploadStatus } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { fileId, status } = await req.json();

    if (!fileId || !status) {
      return new NextResponse("Missing fileId or status", { status: 400 });
    }

    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: { 
        status: status as UploadStatus 
      },
    });

    return NextResponse.json({ success: true, file: updatedFile });
  } catch (error) {
    console.error("Error updating file status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
