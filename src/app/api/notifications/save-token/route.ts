import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Adjust path as needed
import prisma from "@/lib/prisma"; // Adjust path as needed

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { token, platform } = await req.json();

    if (!token) {
      return new NextResponse("Token is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Upsert the token
    const deviceToken = await prisma.deviceToken.upsert({
      where: { token },
      update: {
        updatedAt: new Date(),
        userId: user.id,
      },
      create: {
        token,
        platform: platform || "web",
        userId: user.id,
      },
    });

    return NextResponse.json(deviceToken);
  } catch (error) {
    console.error("[SAVE_TOKEN_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { token } = await req.json();

    if (!token) {
      return new NextResponse("Token is required", { status: 400 });
    }

    await prisma.deviceToken.delete({
      where: { token },
    });

    return new NextResponse("Token deleted", { status: 200 });
  } catch (error) {
    console.error("[DELETE_TOKEN_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
