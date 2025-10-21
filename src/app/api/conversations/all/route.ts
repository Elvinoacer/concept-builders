
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  let authenticatedUserId: string | null = null;
  let authenticatedUserEmail: string | null = null;
  let authenticatedUserRole: string | null = null;

  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("q") || "";
  const filter = searchParams.get("filter") || "all";

  // 1. Check for internal API key first (from Socket.IO backend)
  const apiKey = request.headers.get('X-API-Key');
  if (apiKey && apiKey === process.env.NEXT_API_SECRET_KEY) {
    authenticatedUserId = searchParams.get('userId');

    if (!authenticatedUserId) {
      return new NextResponse("Unauthorized: Missing userId from internal service", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authenticatedUserId },
      select: { email: true, role: true }
    });

    if (!user) {
      return new NextResponse("Unauthorized: User not found for provided ID", { status: 401 });
    }
    authenticatedUserEmail = user.email;
    authenticatedUserRole = user.role;

  } else {
    // 2. If no API key, or invalid API key, proceed with standard session check (from browser)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.user?.id || !session?.user?.role) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    authenticatedUserId = session.user.id;
    authenticatedUserEmail = session.user.email;
    authenticatedUserRole = session.user.role;
  }

  // If neither method authenticated, return unauthorized
  if (!authenticatedUserId || !authenticatedUserEmail || authenticatedUserRole !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const where: any = {
      users: {
        some: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      },
    };

    if (filter === 'unread') {
      where.messages = {
        some: {
          readBy: {
            none: {
              id: authenticatedUserId,
            },
          },
        },
      };
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
