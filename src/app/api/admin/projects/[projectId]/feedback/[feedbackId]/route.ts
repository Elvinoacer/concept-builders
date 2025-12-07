import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; feedbackId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, feedbackId } = await params;

  try {
    const feedback = await prisma.projectFeedback.findUnique({
      where: {
        id: feedbackId,
        projectId: projectId,
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        admin: { select: { id: true, name: true, email: true } },
      },
    });

    if (!feedback) {
      return new NextResponse("Feedback not found", { status: 404 });
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error fetching project feedback detail:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; feedbackId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, feedbackId } = await params;

  try {
    const body = await request.json();
    const { message, rating } = body;

    const updatedFeedback = await prisma.projectFeedback.update({
      where: {
        id: feedbackId,
        projectId: projectId,
      },
      data: {
        message,
        rating: rating ? parseInt(rating) : undefined,
      },
    });

    return NextResponse.json(updatedFeedback);
  } catch (error) {
    console.error("Error updating project feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; feedbackId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, feedbackId } = await params;

  try {
    await prisma.projectFeedback.delete({
      where: {
        id: feedbackId,
        projectId: projectId,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
