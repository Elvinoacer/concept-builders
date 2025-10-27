import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    await prisma.notification.deleteMany({
      where: {
        userId: userId,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error clearing all notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
