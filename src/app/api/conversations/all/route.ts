
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("q") || "";
  const filter = searchParams.get("filter") || "all";

  if (session?.user?.role !== 'ADMIN') {
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
              id: session.user.id,
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
