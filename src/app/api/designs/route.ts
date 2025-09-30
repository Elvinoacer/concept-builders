import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const designs = await prisma.design.findMany();
    return NextResponse.json(designs);
  } catch (error) {
    console.error("Error fetching designs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, basePrice, priceRange, bedrooms, bathrooms, area, floors, categoryId, planDetails } = body;

    if (!name || !description || !basePrice || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const planDetailsArray = planDetails ? planDetails.split('\n').filter(line => line.trim() !== '') : [];

    const newDesign = await prisma.design.create({
      data: {
        name,
        description,
        basePrice,
        priceRange,
        bedrooms,
        bathrooms,
        area,
        floors,
        categoryId,
        planDetails: planDetailsArray,
        // TODO: Add other fields here
        // These are placeholders for now
        images: {},
        renderings: {},
        faqs: {},
        buildingCostEstimates: {},
        tags: {},
        fileTypes: {},
        drawingSetsOptions: {},
      },
    });

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    console.error("Error creating design:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
