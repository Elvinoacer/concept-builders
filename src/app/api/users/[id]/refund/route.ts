import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { purchaseId } = await req.json();

    // Logic to issue a refund

    return NextResponse.json({ message: "Refund issued successfully" });
  } catch (error) {
    console.error("Error issuing refund:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
