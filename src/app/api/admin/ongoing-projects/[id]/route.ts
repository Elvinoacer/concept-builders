
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    const ongoingProject = await prisma.ongoingProject.findUnique({
      where: {
        id,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.ongoingProject.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting ongoing project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      title,
      description,
      clientName,
      location,
      status,
      category,
      startDate,
      estimatedCompletionDate,
      featuredImage,
      gallery,
      size,
      value,
      highlights,
      published
    } = body;

    if (!title) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

    const updatedOngoingProject = await prisma.ongoingProject.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        slug,
        description,
        clientName,
        location,
        status,
        category,
        startDate,
        estimatedCompletionDate,
        featuredImage,
        gallery,
        size,
        value,
        highlights,
        published,
      },
    });

    return NextResponse.json(updatedOngoingProject, { status: 200 });
  } catch (error) {
    console.error("Error updating ongoing project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
