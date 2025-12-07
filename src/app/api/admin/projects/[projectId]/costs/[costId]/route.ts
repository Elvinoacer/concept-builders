import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; costId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, costId } = await params;

  try {
    const cost = await prisma.projectCost.findUnique({
      where: {
        id: costId,
        projectId: projectId,
      },
    });

    if (!cost) {
      return new NextResponse("Cost not found", { status: 404 });
    }

    return NextResponse.json(cost);
  } catch (error) {
    console.error("Error fetching project cost detail:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; costId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, costId } = await params;

  try {
    const body = await request.json();
    const { description, amount, dateIncurred } = body;

    const oldCost = await prisma.projectCost.findUnique({ where: { id: costId } });
    if (!oldCost) {
      return new NextResponse("Cost not found", { status: 404 });
    }

    const updatedCost = await prisma.projectCost.update({
      where: {
        id: costId,
        projectId: projectId,
      },
      data: {
        description,
        amount: amount ? parseFloat(amount) : undefined,
        dateIncurred: dateIncurred ? new Date(dateIncurred) : undefined,
      },
    });

    // Update totalCost on the Project model if amount changed
    if (amount !== undefined && oldCost.amount !== parseFloat(amount)) {
      const amountDifference = parseFloat(amount) - oldCost.amount;
      await prisma.project.update({
        where: { id: projectId },
        data: {
          totalCost: { increment: amountDifference },
        },
      });
    }

    return NextResponse.json(updatedCost);
  } catch (error) {
    console.error("Error updating project cost:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string; costId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, costId } = params;

  try {
    const deletedCost = await prisma.projectCost.delete({
      where: {
        id: costId,
        projectId: projectId,
      },
    });

    // Decrement totalCost on the Project model
    await prisma.project.update({
      where: { id: projectId },
      data: {
        totalCost: { decrement: deletedCost.amount },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project cost:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
