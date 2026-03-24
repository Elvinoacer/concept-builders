import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const canManageDesigns =
      session?.user?.role === "ADMIN" || session?.user?.role === "TEAM";

    if (!canManageDesigns) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const folders = await prisma.folder.findMany({
      where: {},
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
    const canManageDesigns =
      session?.user?.role === "ADMIN" || session?.user?.role === "TEAM";

    if (!session || !session.user?.id || !canManageDesigns) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
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
