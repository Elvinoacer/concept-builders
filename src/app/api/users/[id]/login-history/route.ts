import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
      { status: 500 }
    );
  }
}
