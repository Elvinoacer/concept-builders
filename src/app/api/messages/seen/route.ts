
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  let authenticatedUserId: string | null = null;
  let authenticatedUserEmail: string | null = null;
  let requestBody: any = {}; // Declare requestBody here

  try {
    requestBody = await request.json(); // Read body once
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new NextResponse("Bad Request: Invalid JSON body", { status: 400 });
  }

  // 1. Check for internal API key first (from Socket.IO backend)
  const apiKey = request.headers.get('X-API-Key');
  if (apiKey && apiKey === process.env.NEXT_API_SECRET_KEY) {
    authenticatedUserId = requestBody.userId; // Use the pre-parsed body

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

  try {
    const { conversationId } = requestBody; // Use the pre-parsed body

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

    // Verify that the authenticated user is part of this conversation
    if (!conversation.users.some(user => user.id === authenticatedUserId)) {
      return new NextResponse("Unauthorized: User not part of this conversation", { status: 403 });
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
            id: authenticatedUserId, // Connect by ID instead of email for consistency
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking message as seen:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
