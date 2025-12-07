import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params;

    // Ensure the user is deleting their own feedback
    const feedbackToDelete = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedbackToDelete || feedbackToDelete.userId !== userId) {
      return new NextResponse("Unauthorized to delete this feedback", { status: 403 });
    }

    await prisma.feedback.delete({
      where: { id },
    });

    return new NextResponse("Feedback deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting user feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
