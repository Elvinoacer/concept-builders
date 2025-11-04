import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
        description: true,
        isFeatured: true,
        image: true,
        _count: {
          select: { designs: true },
        },
        designs: {
          orderBy: {
            createdAt: 'asc',
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

    return NextResponse.json({
      categories,
      totalPages: Math.ceil(totalCategories / limit),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Missing category name", { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    revalidatePath('/');

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}