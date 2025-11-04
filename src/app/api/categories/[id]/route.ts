import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const search = request.nextUrl.searchParams.get("search") || "";
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const designsWhere = search
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

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        designs: {
          where: designsWhere,
          skip,
          take: limit,
          include: {
            images: true,
            reviews: true,
            discounts: {
              include: {
                discount: true,
              },
            },
          },
          select: {
            id: true,
            name: true,
            description: true,
            images: true,
            isFeatured: true,
            reviews: true,
            discounts: true,
            basePrice: true,
            bedrooms: true,
            bathrooms: true,
            area: true,
            floors: true,
            orderItems: true,
            architecturalPdfPrice: true,
            architecturalCadPrice: true,
            structuralPdfPrice: true,
            structuralCadPrice: true,
            billOfQuantitiesPrice: true,
            minBuildingCost: true,
            maxBuildingCost: true,
          },
        },
        _count: {
          select: { designs: { where: designsWhere } },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    console.log("Received PUT request body for category:", body); // Added logging
    const { name, image, isFeatured } = body; // Added image and isFeatured

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    // Construct data object for update, only include fields if they are provided
    const updateData: { name: string; image?: string | null; isFeatured?: boolean } = { name };
    if (image !== undefined) { // Allow image to be null
      updateData.image = image;
    }
    if (isFeatured !== undefined) { // Allow isFeatured to be false
      if (typeof isFeatured !== 'boolean') {
        return NextResponse.json({ message: "isFeatured must be a boolean value" }, { status: 400 });
      }
      updateData.isFeatured = isFeatured;
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/');

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.delete({
      where: { id: params.id },
    });

    revalidatePath('/');

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}