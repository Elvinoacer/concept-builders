
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const blogPostCount = await prisma.post.count();

    return NextResponse.json({ blogPostCount });
  } catch (error) {
    console.error("Error fetching blog post count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
