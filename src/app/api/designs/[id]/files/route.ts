import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: designId } = params;
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const files = await prisma.file.findMany({
      where: {
        designId: designId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const totalFiles = await prisma.file.count({
      where: {
        designId: designId,
      },
    });

    return NextResponse.json({
      files,
      totalPages: Math.ceil(totalFiles / limit),
    });
  } catch (error) {
    console.error("Error fetching design files:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}