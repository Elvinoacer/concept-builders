import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const isPrivileged =
    session.user.role === "ADMIN" || session.user.role === "TEAM";

  try {
    const order = await prisma.order.findFirst({
      where: {
        id,
        ...(isPrivileged ? {} : { userId: session.user.id }),
      },
      include: { user: true, items: true },
    });
    if (!order) {
      return new NextResponse("Not Found", { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
