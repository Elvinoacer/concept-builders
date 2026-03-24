import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!targetUser) {
    return new NextResponse("User not found", { status: 404 });
  }

  if (targetUser.role === "ADMIN") {
    return new NextResponse("Cannot impersonate another admin", {
      status: 403,
    });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { impersonatingUserId: targetUser.id },
  });

  return NextResponse.json({ success: true });
}
