import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = (searchParams.get("search") || "").trim();
    const category = (searchParams.get("category") || "all").trim();
    const status = (searchParams.get("status") || "all").trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      24,
      Math.max(1, parseInt(searchParams.get("limit") || "9", 10)),
    );
    const skip = (page - 1) * limit;

    const where = {
      published: true,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                location: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
      ...(category !== "all" ? { category } : {}),
      ...(status !== "all" ? { status } : {}),
    };

    const [projects, totalProjects, categoryOptions, statusOptions] =
      await prisma.$transaction([
        prisma.ongoingProject.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            clientName: true,
            location: true,
            status: true,
            category: true,
            startDate: true,
            featuredImage: true,
            size: true,
          },
        }),
        prisma.ongoingProject.count({ where }),
        prisma.ongoingProject.groupBy({
          by: ["category"],
          where: { published: true },
          orderBy: { category: "asc" },
        }),
        prisma.ongoingProject.groupBy({
          by: ["status"],
          where: { published: true },
          orderBy: { status: "asc" },
        }),
      ]);

    const totalPages = Math.max(1, Math.ceil(totalProjects / limit));

    return NextResponse.json(
      {
        projects,
        pagination: {
          currentPage: page,
          totalPages,
          totalProjects,
          limit,
          hasMore: page < totalPages,
        },
        filters: {
          categories: categoryOptions.map((item) => item.category),
          statuses: statusOptions.map((item) => item.status),
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching ongoing projects:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
