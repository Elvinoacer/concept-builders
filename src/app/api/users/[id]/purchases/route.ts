import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = params.id;

  try {
    const purchases = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            design: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}