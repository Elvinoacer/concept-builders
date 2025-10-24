import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
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
        include: { category: true, files: true },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: pageSize,
      }),
      prisma.design.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({ designs, totalCount, page, pageSize });
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json({ message: "Failed to fetch designs" }, { status: 500 });
  }
}
