import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { id } = await params;

    const user = await prisma.user.update({
      where: { id },
      data: { status: "BLOCKED" },
    });
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
