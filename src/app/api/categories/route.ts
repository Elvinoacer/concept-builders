import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function GET(request: NextRequest) {
  try {
    const forFilters = request.nextUrl.searchParams.get("forFilters");

    if (forFilters) {
      const getCachedCategoriesForFilters = unstable_cache(
        async () =>
          prisma.category.findMany({
            orderBy: {
              isFeatured: "desc",
            },
          }),
        ["categories-filters"],
        { revalidate: 300, tags: ["categories"] },
      );

      const categories = await getCachedCategoriesForFilters();
      return NextResponse.json(categories, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
        },
      });
    }

    const search = request.nextUrl.searchParams.get("search") || "";
    const page = Math.max(
      1,
      parseInt(request.nextUrl.searchParams.get("page") || "1", 10),
    );
    const limit = Math.min(
      50,
      Math.max(
        1,
        parseInt(request.nextUrl.searchParams.get("limit") || "10", 10),
      ),
    );

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          error: "Invalid pagination parameters",
          message: "Page must be at least 1 and limit between 1-100",
        },
        { status: 400 },
      );
    }

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [categories, totalCategories] = await prisma.$transaction([
      prisma.category.findMany({
        where,
        select: {
          id: true,
          name: true,
          isFeatured: true,
          image: true,
          _count: {
            select: { designs: true },
          },
          designs: {
            orderBy: {
              createdAt: "asc",
            },
            take: 1,
            select: {
              id: true,
              images: {
                where: {
                  type: "IMAGE",
                },
                take: 1,
                select: {
                  url: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),
      prisma.category.count({ where }),
    ]);

    return NextResponse.json(
      {
        categories,
        totalPages: Math.ceil(totalCategories / limit),
        currentPage: page,
        totalCategories,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch categories. Please try again later.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Invalid category name",
          message: "Category name is required and must be a non-empty string",
        },
        { status: 400 },
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
      },
    });

    revalidateTag("categories", "max");

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating category:", error);

    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return NextResponse.json(
        {
          error: "Category already exists",
          message: "A category with this name already exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create category. Please try again later.",
      },
      { status: 500 },
    );
  }
}
