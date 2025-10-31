
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const ongoingProject = await prisma.ongoingProject.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!ongoingProject) {
      return new NextResponse("Project not found", { status: 404 });
    }

    return NextResponse.json(ongoingProject);
  } catch (error) {
    console.error("Error fetching ongoing project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
