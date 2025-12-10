import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { question } = await req.json();

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  try {
    const design = await prisma.design.findUnique({
      where: { id },
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    const newFaq = {
      question,
      answer: "", // Default answer is empty
    };

    const updatedFaqs = [...(design.faq as any[]), newFaq];

    await prisma.design.update({
      where: { id },
      data: { faq: updatedFaqs },
    });

    return NextResponse.json({ message: "FAQ submitted successfully" });
  } catch (error) {
    console.error("Failed to submit FAQ:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
