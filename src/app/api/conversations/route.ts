
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  let authenticatedUserId: string | null = null;
  let authenticatedUserEmail: string | null = null;

  // 1. Check for internal API key first (from Socket.IO backend)
  const apiKey = request.headers.get('X-API-Key');
  if (apiKey && apiKey === process.env.NEXT_API_SECRET_KEY) {
    authenticatedUserId = request.nextUrl.searchParams.get('userId');

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
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            email: authenticatedUserEmail,
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
