
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const ongoingProjects = await prisma.ongoingProject.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(ongoingProjects);
  } catch (error) {
    console.error("Error fetching ongoing projects:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
