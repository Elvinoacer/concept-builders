import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const projectId = params.id;

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: userId, // Ensure the user owns the project
      },
    });

    if (!project) {
      return new NextResponse("Project not found or unauthorized", { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}