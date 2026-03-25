import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
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
    const skip = (page - 1) * limit;

    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

    const [categories, totalCategories] = await prisma.$transaction([
      prisma.category.findMany({
        where,
        include: {
          _count: {
            select: { designs: true },
          },
          designs: {
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
            select: {
              images: {
                take: 1,
                orderBy: {
                  createdAt: "desc",
                },
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
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
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
