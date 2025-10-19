import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search") || "";
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const categoryId = request.nextUrl.searchParams.get("categoryId");

    const where: any = search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const designs = await prisma.design.findMany({
      where,
      skip,
      take: limit,
      include: {
        files: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalDesigns = await prisma.design.count({ where });

    return NextResponse.json({
      designs,
      totalPages: Math.ceil(totalDesigns / limit),
    });
  } catch (error) {
    console.error("Error fetching designs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      basePrice,
      priceRange,
      bedrooms,
      bathrooms,
      area,
      floors,
      categoryId,
      planDetails,
      folderId,
      buildingCostEstimates,
      calculatorOptions,
      files,
    } = body;

    if (!name || !description || !basePrice || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const designData = {
      name,
      description,
      basePrice,
      priceRange: priceRange || "",
      bedrooms,
      bathrooms,
      area,
      floors,
      categoryId,
      planDetails: planDetails || [],
      folderId,
      buildingCostEstimates,
      calculatorOptions,
      files: {
        create: files.map(
          (file: { url: string; type: string; originalFileName: string }) => ({
            url: file.url,
            type: file.type,
            originalFileName: file.originalFileName,
          })
        ),
      },
    };

    console.log("Creating design with data:", designData);

    const newDesign = await prisma.design.create({
      data: designData,
    });

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    console.error("Error creating design:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
