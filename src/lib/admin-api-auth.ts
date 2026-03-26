import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function requireAdminOrTeam() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "TEAM") {
    return {
      error: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { session };
}
