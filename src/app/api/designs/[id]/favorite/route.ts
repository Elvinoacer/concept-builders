import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return new NextResponse("Design ID missing", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { wishlist: true },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const isFavorited = user.wishlist.some((design) => design.id === id);

  if (isFavorited) {
    // Remove from wishlist
    await prisma.user.update({
      where: { id: user.id },
      data: {
        wishlist: {
          disconnect: { id },
        },
      },
    });
  } else {
    // Add to wishlist
    await prisma.user.update({
      where: { id: user.id },
      data: {
        wishlist: {
          connect: { id },
        },
      },
    });
  }

  return new NextResponse("Success", { status: 200 });
}