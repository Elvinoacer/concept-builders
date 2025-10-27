import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; requirementId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, requirementId } = params;

  try {
    const requirement = await prisma.projectRequirement.findUnique({
      where: {
        id: requirementId,
        projectId: projectId,
      },
    });

    if (!requirement) {
      return new NextResponse("Requirement not found", { status: 404 });
    }

    return NextResponse.json(requirement);
  } catch (error) {
    console.error("Error fetching project requirement detail:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string; requirementId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, requirementId } = params;

  try {
    const body = await request.json();
    const { description, status } = body;

    const updatedRequirement = await prisma.projectRequirement.update({
      where: {
        id: requirementId,
        projectId: projectId,
      },
      data: {
        description,
        status,
      },
    });

    return NextResponse.json(updatedRequirement);
  } catch (error) {
    console.error("Error updating project requirement:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string; requirementId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, requirementId } = params;

  try {
    await prisma.projectRequirement.delete({
      where: {
        id: requirementId,
        projectId: projectId,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project requirement:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
