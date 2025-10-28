import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const priceType = searchParams.get("priceType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const styles = searchParams.get("styles")?.split(",");
    const minSize = searchParams.get("minSize");
    const maxSize = searchParams.get("maxSize");
    const sortBy = searchParams.get("sortBy");
    const categoryId = searchParams.get("categoryId");
    const exclude = searchParams.get("exclude");
    const isFeatured = searchParams.get("isFeatured");

    const where: any = {
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
    };

    if (priceType === "design" && (minPrice || maxPrice)) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    } else if (priceType === "building" && (minPrice || maxPrice)) {
      where.minBuildingCost = {};
      if (minPrice) where.minBuildingCost.gte = parseFloat(minPrice);
      if (maxPrice) where.maxBuildingCost = { lte: parseFloat(maxPrice) };
    }

    if (bedrooms) {
      if (bedrooms === "4+") {
        where.bedrooms = { gte: 4 };
      } else {
        where.bedrooms = parseInt(bedrooms);
      }
    }

    if (styles && styles.length > 0) {
      const categories = await prisma.category.findMany({
        where: {
          name: {
            in: styles,
          },
        },
      });
      const categoryIds = categories.map((c) => c.id);
      where.categoryId = { in: categoryIds };
    }

    if (minSize || maxSize) {
      where.area = {};
      if (minSize) where.area.gte = parseFloat(minSize);
      if (maxSize) where.area.lte = parseFloat(maxSize);
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (exclude) {
      where.id = { not: exclude };
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy) {
      switch (sortBy) {
        case "Popular":
          orderBy = { views: "desc" };
          break;
        case "Price (Low to High)":
          orderBy = { basePrice: "asc" };
          break;
        case "Price (High to Low)":
          orderBy = { basePrice: "desc" };
          break;
        default:
          orderBy = { createdAt: "desc" };
      }
    }

    const designs = await prisma.design.findMany({
      where,
      skip,
      take: limit,
      include: {
        files: true,
        reviews: true,
        category: true,
        discounts: {
          include: {
            discount: true,
          },
        },
        orderItems: true,
      },
      orderBy,
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
      buildingCostFactors,
      packageOptions,
      files,
      minBuildingCost,
      maxBuildingCost,
      pdfPrice,
      cadPrice,
      pdfAndCadPrice,
    } = body;

    if (!name || !description || !basePrice || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const designData: any = {
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
      buildingCostFactors,
      packageOptions,
      minBuildingCost,
      maxBuildingCost,
      pdfPrice,
      cadPrice,
      pdfAndCadPrice,
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

    revalidatePath('/');

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    console.error("Error creating design:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}