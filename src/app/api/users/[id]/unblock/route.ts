import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { status: "ACTIVE" },
    });
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
