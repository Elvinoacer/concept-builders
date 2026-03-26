import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function POST(req: NextRequest) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { fileId } = await req.json();

    if (!fileId || typeof fileId !== "string") {
      return NextResponse.json({ error: "Invalid fileId" }, { status: 400 });
    }

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
