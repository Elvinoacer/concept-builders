import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { phone } = body;

    await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        phone,
      },
    });

    return new NextResponse("OK");
  } catch (error) {
    console.error("[PHONE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
