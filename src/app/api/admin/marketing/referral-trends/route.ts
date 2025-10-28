import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const timePeriod = searchParams.get("timePeriod") || "Last 6 Months";

    let startDate: Date;
    const now = new Date();

    if (timePeriod === "Today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (timePeriod === "Last 7 Days") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (timePeriod === "Last 1 Month") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (timePeriod === "Last 6 Months") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    } else if (timePeriod === "Last 1 Year") {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    } else if (timePeriod === "All Time") {
      startDate = new Date(0); // Epoch start
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()); // Default to Last 6 Months
    }

    const referralVisits = await prisma.referralVisit.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: now,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Aggregate data by day and source
    const aggregatedDataMap = new Map<string, Map<string, number>>(); // Map<date, Map<source, count>>

    referralVisits.forEach((visit) => {
      const dateKey = visit.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
      if (!aggregatedDataMap.has(dateKey)) {
        aggregatedDataMap.set(dateKey, new Map<string, number>());
      }
      const sourceMap = aggregatedDataMap.get(dateKey)!;
      sourceMap.set(visit.source, (sourceMap.get(visit.source) || 0) + 1);
    });

    // Convert to a format suitable for charting
    const chartData: { date: string; [key: string]: any }[] = [];
    const allSources = new Set<string>();

    // Collect all unique sources
    aggregatedDataMap.forEach((sourceMap) => {
      sourceMap.forEach((_, source) => allSources.add(source));
    });

    // Fill in missing dates and sources with 0
    let currentDate = new Date(startDate);
    while (currentDate <= now) {
      const dateKey = currentDate.toISOString().split("T")[0];
      const row: { date: string; [key: string]: any } = { date: dateKey };

      allSources.forEach((source) => {
        row[source] = aggregatedDataMap.get(dateKey)?.get(source) || 0;
      });
      chartData.push(row);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error fetching referral trends:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
