import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

import { Role } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const clients = await prisma.user.findMany({
      where: {
        role: Role.CLIENT,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
