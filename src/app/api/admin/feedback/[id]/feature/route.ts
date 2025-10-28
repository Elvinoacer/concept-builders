import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    const { isFeatured } = await request.json();

    if (typeof isFeatured !== 'boolean') {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: { isFeatured },
    });

    revalidatePath('/');

    return NextResponse.json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}