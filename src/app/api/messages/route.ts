
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  let authenticatedUserId: string | null = null;
  let authenticatedUserEmail: string | null = null;

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  // 1. Check for internal API key first (from Socket.IO backend)
  const apiKey = request.headers.get('X-API-Key');
  if (apiKey && apiKey === process.env.NEXT_API_SECRET_KEY) {
    authenticatedUserId = searchParams.get('userId');

    if (!authenticatedUserId) {
      return new NextResponse("Unauthorized: Missing userId from internal service", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authenticatedUserId },
      select: { email: true }
    });

    if (!user) {
      return new NextResponse("Unauthorized: User not found for provided ID", { status: 401 });
    }
    authenticatedUserEmail = user.email;

  } else {
    // 2. If no API key, or invalid API key, proceed with standard session check (from browser)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    authenticatedUserId = session.user.id;
    authenticatedUserEmail = session.user.email;
  }

  // If neither method authenticated, return unauthorized
  if (!authenticatedUserId || !authenticatedUserEmail) {
    return new NextResponse("Unauthorized: No valid authentication found", { status: 401 });
  }

  if (!conversationId) {
    return new NextResponse("Missing conversationId", { status: 400 });
  }

  try {
    // Verify that the authenticated user is part of this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true },
    });

    if (!conversation || !conversation.users.some(user => user.id === authenticatedUserId)) {
      return new NextResponse("Unauthorized: User not part of this conversation", { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        readBy: true,
        attachments: true, // Include attachments in the response
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
  let authenticatedUserId: string | null = null;
  let authenticatedUserEmail: string | null = null;
  let requestBody: any = {};

  try {
    requestBody = await request.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new NextResponse("Bad Request: Invalid JSON body", { status: 400 });
  }

  // 1. Check for internal API key first (from Socket.IO backend)
  const apiKey = request.headers.get('X-API-Key');
  if (apiKey && apiKey === process.env.NEXT_API_SECRET_KEY) {
    authenticatedUserId = requestBody.senderId;

    if (!authenticatedUserId) {
      return new NextResponse("Unauthorized: Missing senderId from internal service", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authenticatedUserId },
      select: { email: true }
    });

    if (!user) {
      return new NextResponse("Unauthorized: User not found for provided ID", { status: 401 });
    }
    authenticatedUserEmail = user.email;

  } else {
    // 2. If no API key, or invalid API key, proceed with standard session check (from browser)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    authenticatedUserId = session.user.id;
    authenticatedUserEmail = session.user.email;
  }

  // If neither method authenticated, return unauthorized
  if (!authenticatedUserId || !authenticatedUserEmail) {
    return new NextResponse("Unauthorized: No valid authentication found", { status: 401 });
  }

  try {
    const { content, conversationId, recipientId, attachments } = requestBody; // Get attachments array

    if (!content && (!attachments || attachments.length === 0)) {
      return new NextResponse("Missing content or attachments", { status: 400 });
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

      const isUserInConversation = conversation.users.some(user => user.id === authenticatedUserId);
      if (!isUserInConversation) {
        return new NextResponse("Unauthorized to send message to this conversation", { status: 403 });
      }

    } else if (recipientId) {
      if (authenticatedUserId !== requestBody.senderId) {
        return new NextResponse("Unauthorized: Sender ID mismatch", { status: 403 });
      }

      const existingConversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            { users: { some: { id: authenticatedUserId } } },
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
              connect: [{ id: authenticatedUserId }, { id: recipientId }],
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
        conversationId: conversation.id,
        senderId: authenticatedUserId,
        attachments: {
          create: attachments ? attachments.map((att: any) => ({
            url: att.url,
            type: att.type,
            name: att.name,
          })) : [],
        },
      },
      include: {
        sender: true,
        attachments: true, // Include attachments in the response
        conversation: {
          include: {
            users: true,
          },
        },
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
