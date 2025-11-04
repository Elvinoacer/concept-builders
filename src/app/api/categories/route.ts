import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Type for category response
interface CategoryResponse {
  id: string;
  name: string;
  description: string | null;
  isFeatured: boolean;
  image: string | null;
  _count: {
    designs: number;
  };
  designs: Array<{
    id: string;
    images: Array<{
      url: string;
    }>;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const forFilters = request.nextUrl.searchParams.get("forFilters");

    if (forFilters) {
      const categories = await prisma.category.findMany({
        orderBy: {
          isFeatured: "desc",
        },
      });
      return NextResponse.json(categories);
    }

    const search = request.nextUrl.searchParams.get("search") || "";
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          error: "Invalid pagination parameters",
          message: "Page must be at least 1 and limit between 1-100",
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const categories = await prisma.category.findMany({
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
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    const totalCategories = await prisma.category.count({ where });

    // Transform the data to ensure consistent structure
    const transformedCategories = categories.map((category) => ({
      ...category,
      description: category.description || "",
      image: category.image || null,
      designs: category.designs || [],
    }));

    return NextResponse.json({
      categories: transformedCategories,
      totalPages: Math.ceil(totalCategories / limit),
      currentPage: page,
      totalCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch categories. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Invalid category name",
          message: "Category name is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
      },
    });

    revalidatePath("/");

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Category already exists",
          message: "A category with this name already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create category. Please try again later.",
      },
      { status: 500 }
    );
  }
}
