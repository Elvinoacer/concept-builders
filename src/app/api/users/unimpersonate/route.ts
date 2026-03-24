import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  const adminUserId = session?.impersonator?.id || session?.user?.id;

  if (!adminUserId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.user.update({
    where: { id: adminUserId },
    data: { impersonatingUserId: null },
  });

  return NextResponse.json({ success: true });
}
