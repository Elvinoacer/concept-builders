
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            email: session.user.email,
          },
        },
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
