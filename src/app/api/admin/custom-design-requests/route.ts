import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function GET() {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

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
