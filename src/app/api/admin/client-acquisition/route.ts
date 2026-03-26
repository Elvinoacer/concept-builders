import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function GET() {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const acquisitionData = await prisma.user.groupBy({
      by: ["referralSource"],
      _count: {
        _all: true,
      },
      where: {
        referralSource: {
          not: null,
        },
      },
    });

    const formattedData = acquisitionData.map((item) => ({
      source: item.referralSource,
      count: item._count._all,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching client acquisition:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
