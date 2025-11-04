import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; faqIndex: string } }
) {
  const { id, faqIndex } = params;
  const { answer } = await req.json();

  if (!answer) {
    return NextResponse.json({ error: "Answer is required" }, { status: 400 });
  }

  try {
    const design = await prisma.design.findUnique({
      where: { id },
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    const faqIndexInt = parseInt(faqIndex, 10);
    const faqs = design.faq as any[];

    if (isNaN(faqIndexInt) || faqIndexInt < 0 || faqIndexInt >= faqs.length) {
      return NextResponse.json({ error: "Invalid FAQ index" }, { status: 400 });
    }

    faqs[faqIndexInt].answer = answer;

    await prisma.design.update({
      where: { id },
      data: { faq: faqs },
    });

    return NextResponse.json({ message: "FAQ answer submitted successfully" });
  } catch (error) {
    console.error("Failed to submit FAQ answer:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
