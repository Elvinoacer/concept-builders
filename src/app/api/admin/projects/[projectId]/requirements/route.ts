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
    const requirements = await prisma.projectRequirement.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(requirements);
  } catch (error) {
    console.error("Error fetching project requirements:", error);
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
    const { description, status } = body;

    if (!description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newRequirement = await prisma.projectRequirement.create({
      data: {
        projectId,
        description,
        status,
      },
    });

    return NextResponse.json(newRequirement, { status: 201 });
  } catch (error) {
    console.error("Error creating project requirement:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
