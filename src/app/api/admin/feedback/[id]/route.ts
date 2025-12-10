import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    await prisma.feedback.delete({
      where: { id },
    });

    return new NextResponse("Feedback deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
