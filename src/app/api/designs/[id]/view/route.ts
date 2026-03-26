import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: designId } = await params;
  const session = await getServerSession(authOptions);

  if (!designId) {
    return new NextResponse("Design ID is required", { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      let shouldIncrement = true;

      if (session?.user?.id) {
        const existingView = await tx.designView.findFirst({
          where: {
            designId,
            userId: session.user.id,
          },
          select: { id: true },
        });

        if (!existingView) {
          await tx.designView.create({
            data: {
              designId,
              userId: session.user.id,
            },
          });
        } else {
          shouldIncrement = false;
        }
      }

      if (shouldIncrement) {
        await tx.design.update({
          where: { id: designId },
          data: {
            views: {
              increment: 1,
            },
          },
        });
      }
    });

    return new NextResponse("View tracked successfully", { status: 200 });
  } catch (error) {
    console.error("Error tracking design view:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
