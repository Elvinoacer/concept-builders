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
    const costs = await prisma.projectCost.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        dateIncurred: "desc",
      },
    });
    return NextResponse.json(costs);
  } catch (error) {
    console.error("Error fetching project costs:", error);
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
    const { description, amount, dateIncurred } = body;

    if (!description || !amount) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newCost = await prisma.projectCost.create({
      data: {
        projectId,
        description,
        amount: parseFloat(amount),
        dateIncurred: dateIncurred ? new Date(dateIncurred) : new Date(),
      },
    });

    // Optionally update totalCost on the Project model
    await prisma.project.update({
      where: { id: projectId },
      data: {
        totalCost: { increment: parseFloat(amount) },
      },
    });

    return NextResponse.json(newCost, { status: 201 });
  } catch (error) {
    console.error("Error creating project cost:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
