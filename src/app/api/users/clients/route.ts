
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const clients = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
