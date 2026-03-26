import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
