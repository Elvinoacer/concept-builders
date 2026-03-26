import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const ongoingProject = await prisma.ongoingProject.findUnique({
      where: {
        slug,
      },
    });

    if (!ongoingProject) {
      return new NextResponse("Project not found", { status: 404 });
    }

    return NextResponse.json(ongoingProject, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching ongoing project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
