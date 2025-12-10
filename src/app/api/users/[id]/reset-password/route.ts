import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // In a real application, you would generate a new password, hash it,
    // and then update the user's password in the database.
    // For now, we'll just update a 'passwordResetRequested' field or similar.
    const user = await prisma.user.update({
      where: { id },
      data: { hashedPassword: null, status: "ACTIVE" }, // Or set a temporary password
    });
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
