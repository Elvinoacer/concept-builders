import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const { designId } = await request.json();

  if (!designId) {
    return new NextResponse("Design ID is required", { status: 400 });
  }

  try {
    // 1. Verify if the user has purchased this design
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        designId: designId,
        order: {
          userId: userId,
          status: "PAID", // Ensure the order is paid
        },
      },
    });

    if (!orderItem) {
      return new NextResponse("Design not purchased or order not paid", { status: 403 });
    }

    // 2. Fetch design details
    const design = await prisma.design.findUnique({
      where: {
        id: designId,
      },
      include: {
        files: true,
      },
    });

    if (!design) {
      return new NextResponse("Design not found", { status: 404 });
    }

    // 3. Create a new project
    const newProject = await prisma.project.create({
      data: {
        name: `${design.name} Project`,
        description: `Project initialized from design: ${design.name}`,
        imageUrl: design.files.find(file => file.type === "FLOOR_PLAN")?.url || design.files.find(file => file.type === "IMAGE")?.url || null, // Prioritize FLOOR_PLAN, then IMAGE
        userId: userId,
        status: "Planning",
        progress: 0,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error initializing project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
