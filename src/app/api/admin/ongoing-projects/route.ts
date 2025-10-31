
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

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

export async function POST(request: NextRequest) {
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

    const newOngoingProject = await prisma.ongoingProject.create({
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

    return NextResponse.json(newOngoingProject, { status: 201 });
  } catch (error) {
    console.error("Error creating ongoing project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
