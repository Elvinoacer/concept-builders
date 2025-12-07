import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: notificationId } = await params;

  try {
    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id, // Ensure admin can only update their own notifications
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: notificationId } = await params;

  try {
    await prisma.notification.delete({
      where: {
        id: notificationId,
        userId: session.user.id, // Ensure admin can only delete their own notifications
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
