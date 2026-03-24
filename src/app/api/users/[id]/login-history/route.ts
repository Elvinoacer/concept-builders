import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "TEAM" &&
      session.user.id !== id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const loginHistory = await prisma.loginHistory.findMany({
      where: { userId: id },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(loginHistory);
  } catch (error) {
    console.error("Error fetching login history:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
