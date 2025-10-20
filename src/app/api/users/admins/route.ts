
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
