import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "TEAM")
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = await params;

  try {
    const temporaryPassword = crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 12);
    const hashedTemp = await bcrypt.hash(temporaryPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { hashedPassword: hashedTemp, status: "ACTIVE" },
    });

    return NextResponse.json({
      success: true,
      userId: id,
      temporaryPassword,
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
