import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { fileId } = await req.json();

    // Delete file record if upload failed
    await prisma.file.delete({
      where: { id: fileId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cleaning up file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
