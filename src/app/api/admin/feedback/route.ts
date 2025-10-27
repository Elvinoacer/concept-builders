import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // if (!session || session.user.role !== 'ADMIN') {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { feedback: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const feedback = await prisma.feedback.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const totalFeedback = await prisma.feedback.count({ where });

    return NextResponse.json({
      feedback,
      totalPages: Math.ceil(totalFeedback / limit),
      currentPage: page,
      totalFeedback,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
