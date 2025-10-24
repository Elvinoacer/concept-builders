import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const requests = await prisma.customDesignRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching custom design requests:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
