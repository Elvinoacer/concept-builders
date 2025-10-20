
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");
  const lastMessageTimestamp = searchParams.get("lastMessageTimestamp");

  if (!conversationId || !lastMessageTimestamp) {
    return new NextResponse("Missing conversationId or lastMessageTimestamp", {
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  // Ensure user is part of the conversation
  const conversation = await prisma.conversation.findFirst({
      where: {
          id: conversationId,
          users: {
              some: {
                  id: user.id
              }
          }
      }
  });

  if (!conversation) {
      return new NextResponse("Unauthorized or conversation not found", { status: 403 });
  }


  const timeout = 25000; // 25 seconds
  const startTime = Date.now();

  try {
    while (Date.now() - startTime < timeout) {
      const messages = await prisma.message.findMany({
        where: {
          conversationId: conversationId,
          createdAt: {
            gt: new Date(lastMessageTimestamp),
          },
        },
        include: {
          sender: true,
          readBy: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (messages.length > 0) {
        return NextResponse.json(messages);
      }

      // Wait for 1 second before polling the database again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // If timeout is reached, return an empty array
    return NextResponse.json([]);
  } catch (error) {
    console.error("Long polling error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
