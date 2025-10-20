
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!conversationId) {
    return new NextResponse("Missing conversationId", { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        readBy: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { content, attachmentUrl, attachmentType, conversationId, recipientId, tempId } = body;

    if (!content && !attachmentUrl) {
      return new NextResponse("Missing content or attachmentUrl", { status: 400 });
    }

    let conversation;

    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { users: true },
      });

      if (!conversation) {
        return new NextResponse("Conversation not found", { status: 404 });
      }

      const isUserInConversation = conversation.users.some(user => user.email === session.user.email);
      if (!isUserInConversation) {
        return new NextResponse("Unauthorized to send message to this conversation", { status: 403 });
      }

    } else if (recipientId) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            { users: { some: { email: session.user.email } } },
            { users: { some: { id: recipientId } } },
          ],
        },
      });

      if (existingConversation) {
        conversation = existingConversation;
      } else {
        conversation = await prisma.conversation.create({
          data: {
            users: {
              connect: [{ email: session.user.email }, { id: recipientId }],
            },
          },
        });
      }
    } else {
      return new NextResponse("Missing conversationId or recipientId", { status: 400 });
    }

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const newMessage = await prisma.message.create({
      data: {
        content,
        attachmentUrl,
        attachmentType,
        conversationId: conversation.id,
        senderId: session.user.id,
      },
      include: {
        sender: true,
      },
    });

    

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
