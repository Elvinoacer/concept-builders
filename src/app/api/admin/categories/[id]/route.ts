import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = request.nextUrl;
    const designPage = parseInt(searchParams.get("designPage") || "1");
    const designLimit = parseInt(searchParams.get("designLimit") || "10");
    const designSearch = searchParams.get("designSearch") || "";

    const designSkip = (designPage - 1) * designLimit;

    const designWhere = designSearch
      ? {
          name: {
            contains: designSearch,
            mode: "insensitive",
          },
        }
      : {};

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        designs: {
          where: designWhere,
          include: {
            files: true,
            architecturalDesign: {
              include: {
                pdfFiles: true,
                cadFiles: true,
              },
            },
            structuralDesign: {
              include: {
                pdfFiles: true,
                cadFiles: true,
              },
            },
            billOfQuantities: {
              include: {
                excelFiles: true,
              },
            },
          },
          skip: designSkip,
          take: designLimit,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const totalDesignsInCategory = await prisma.design.count({
      where: {
        categoryId: params.id,
        ...designWhere,
      },
    });

    return NextResponse.json({
      ...category,
      designsTotalPages: Math.ceil(totalDesignsInCategory / designLimit),
    });
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
    const body = await request.json();

    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: body,
    });

    revalidatePath("/"); // Revalidate the homepage to show updated featured categories

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

    revalidatePath("/"); // Revalidate the homepage after deleting a category

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
