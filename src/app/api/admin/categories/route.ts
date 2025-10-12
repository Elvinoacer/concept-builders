import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search") || "";
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { designs: true },
        },
        designs: {
          take: 1, // Take only the latest design
          orderBy: {
            createdAt: "desc", // Order by creation date to get the latest
          },
          select: {
            files: {
              where: {
                type: "IMAGE", // Only consider image files
              },
              take: 1, // Take only one image file
              orderBy: {
                createdAt: "desc", // Get the latest image if multiple
              },
              select: {
                url: true, // Select only the URL of the image
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

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
