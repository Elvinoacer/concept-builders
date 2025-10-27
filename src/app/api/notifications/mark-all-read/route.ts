import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    await prisma.notification.updateMany({
      where: {
        userId: userId,
        read: false, // Only mark unread notifications
      },
      data: {
        read: true,
      },
    });
    return new NextResponse("Notifications marked as read", { status: 200 });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
