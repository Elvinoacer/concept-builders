import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (session?.user?.role !== "ADMIN") {
      return new NextResponse("Forbidden: Admins only", { status: 403 });
    }
    const isAdmin = session.user.role === 'ADMIN';

    const folders = await prisma.folder.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      include: {
        _count: {
          select: {
            designs: true,
          },
        },
      },
    });

    return NextResponse.json(folders, { status: 200 });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized: User ID is missing from session", {
        status: 401,
      });
    }

    if (session?.user?.role !== "ADMIN") {
      return new NextResponse("Forbidden: Admins only", { status: 403 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Missing folder name", { status: 400 });
    }

    const newFolder = await prisma.folder.create({
      data: {
        name,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    console.error("Error creating folder:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
