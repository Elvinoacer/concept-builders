import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper to get DigitalOcean costs (mocked for now)
async function getDigitalOceanCosts() {
  // In a real application, this would call the DigitalOcean API
  // For now, we'll use a mock value or fetch from our existing endpoint
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/digitalocean-costs`);
    if (response.ok) {
      const data = await response.json();
      // Assuming data contains totalUsage for the current month
      return data.totalUsage || 0;
    }
  } catch (error) {
    console.error("Error fetching DigitalOcean costs:", error);
  }
  return 0; // Default to 0 if fetch fails
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month

    // Check if costs for this month already exist
    const existingCosts = await prisma.monthlyCost.findUnique({
      where: {
        month: currentMonth,
      },
    });

    if (existingCosts) {
      return NextResponse.json(
        { message: "Costs for this month already calculated." },
        { status: 200 }
      );
    }

    // Fetch DigitalOcean costs
    const digitalOceanCosts = await getDigitalOceanCosts();

    // Define fixed costs for Resend and Hosting (can be made configurable)
    const resendEmailsCosts = 25.00; // Example fixed cost
    const hostingCosts = 20.00; // Example fixed cost

    const totalCosts = digitalOceanCosts + resendEmailsCosts + hostingCosts;

    const newMonthlyCost = await prisma.monthlyCost.create({
      data: {
        month: currentMonth,
        digitalOcean: digitalOceanCosts,
        resendEmails: resendEmailsCosts,
        hosting: hostingCosts,
        total: totalCosts,
      },
    });

    return NextResponse.json(newMonthlyCost, { status: 201 });
  } catch (error) {
    console.error("Error calculating and saving monthly costs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
