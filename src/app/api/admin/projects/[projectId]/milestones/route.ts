import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const projectId = params.projectId;

  try {
    const milestones = await prisma.projectMilestone.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        dueDate: "asc",
      },
    });
    return NextResponse.json(milestones);
  } catch (error) {
    console.error("Error fetching project milestones:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const projectId = params.projectId;

  try {
    const body = await request.json();
    const { name, description, dueDate, status } = body;

    if (!name || !dueDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newMilestone = await prisma.projectMilestone.create({
      data: {
        projectId,
        name,
        description,
        dueDate: new Date(dueDate),
        status,
      },
    });

    return NextResponse.json(newMilestone, { status: 201 });
  } catch (error) {
    console.error("Error creating project milestone:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
