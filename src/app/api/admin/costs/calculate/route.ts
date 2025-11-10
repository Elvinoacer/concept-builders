import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = new Date();
    const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // TODO: Implement actual DigitalOcean cost calculation via their API
    const digitalOceanCost = 10.0; // Placeholder value

    const resendCost = 0.0;
    const hostPinnacleDomainCost = 22.26 + 4.49;
    const vercelHostingCost = 0.0;
    const hostingCost = hostPinnacleDomainCost + vercelHostingCost;

    const totalCost = digitalOceanCost + resendCost + hostingCost;

    const existingCost = await prisma.monthlyCost.findFirst({
      where: { month },
    });

    if (existingCost) {
      await prisma.monthlyCost.update({
        where: { id: existingCost.id },
        data: {
          digitalOcean: digitalOceanCost,
          resendEmails: resendCost,
          hosting: hostingCost,
          total: totalCost,
        },
      });
    } else {
      await prisma.monthlyCost.create({
        data: {
          month,
          digitalOcean: digitalOceanCost,
          resendEmails: resendCost,
          hosting: hostingCost,
          total: totalCost,
        },
      });
    }

    return NextResponse.json({ message: "Monthly costs calculated successfully." });
  } catch (error) {
    console.error("Error calculating monthly costs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}