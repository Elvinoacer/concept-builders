import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; milestoneId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, milestoneId } = params;

  try {
    const milestone = await prisma.projectMilestone.findUnique({
      where: {
        id: milestoneId,
        projectId: projectId,
      },
    });

    if (!milestone) {
      return new NextResponse("Milestone not found", { status: 404 });
    }

    return NextResponse.json(milestone);
  } catch (error) {
    console.error("Error fetching project milestone detail:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string; milestoneId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, milestoneId } = params;

  try {
    const body = await request.json();
    const { name, description, dueDate, completedDate, status } = body;

    const updatedMilestone = await prisma.projectMilestone.update({
      where: {
        id: milestoneId,
        projectId: projectId,
      },
      data: {
        name,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        completedDate: completedDate ? new Date(completedDate) : undefined,
        status,
      },
    });

    return NextResponse.json(updatedMilestone);
  } catch (error) {
    console.error("Error updating project milestone:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string; milestoneId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, milestoneId } = params;

  try {
    await prisma.projectMilestone.delete({
      where: {
        id: milestoneId,
        projectId: projectId,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project milestone:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
