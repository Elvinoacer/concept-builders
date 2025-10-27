import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new NextResponse("Missing currentPassword or newPassword", { status: 400 });
    }

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashedPassword) {
      return new NextResponse("User not found or password not set", { status: 404 });
    }

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isPasswordValid) {
      return new NextResponse("Invalid current password", { status: 401 });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedPassword: hashedNewPassword,
      },
    });

    return new NextResponse("Password updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}