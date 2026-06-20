import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const canManageDesigns =
      session?.user?.role === "ADMIN" || session?.user?.role === "TEAM";

    if (!canManageDesigns) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)),
    );
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * pageSize;

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [designs, totalCount] = await prisma.$transaction([
      prisma.design.findMany({
        where: whereClause,
        include: {
          category: true,
          files: true,
          images: {
            where: { type: "IMAGE" },
            take: 1,
            select: { url: true },
          },
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
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: pageSize,
      }),
      prisma.design.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json(
      { designs, totalCount, page, pageSize },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json(
      { message: "Failed to fetch designs" },
      { status: 500 },
    );
  }
}
