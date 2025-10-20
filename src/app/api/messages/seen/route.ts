
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusher } from "@/app/api/pusher/auth/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return new NextResponse("Missing conversationId", { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { include: { readBy: true } }, users: true },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // Update seen status of last message
    await prisma.message.update({
      where: { id: lastMessage.id },
      data: {
        readBy: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });

    // Trigger a pusher event to notify other users
    await pusher.trigger(conversationId, "message:seen", lastMessage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking message as seen:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
