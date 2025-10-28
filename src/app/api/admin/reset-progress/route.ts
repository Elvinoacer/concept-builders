import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.project.updateMany({
      data: {
        progress: 0,
        status: "PLANNING", // Optionally reset status to PLANNING
        completionRemarks: null,
        declaration: false,
      },
    });

    return NextResponse.json({ message: "Project progress reset successfully" });
  } catch (error) {
    console.error("Error resetting project progress:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
