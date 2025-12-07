import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const projectId = (await params).projectId;

  try {
    const feedback = await prisma.projectFeedback.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        admin: { select: { id: true, name: true, email: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error fetching project feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const projectId = (await params).projectId;

  try {
    const body = await request.json();
    const { clientId, adminId, message, rating } = body;

    if (!message || !clientId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newFeedback = await prisma.projectFeedback.create({
      data: {
        projectId,
        clientId,
        adminId,
        message,
        rating: rating ? parseInt(rating) : undefined,
      },
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error("Error creating project feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
