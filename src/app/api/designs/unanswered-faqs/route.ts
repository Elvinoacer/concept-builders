import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const designs = await prisma.design.findMany();

    const designsWithUnansweredFaqs = designs
      .map(design => {
        if (Array.isArray(design.faq)) {
          const unansweredFaqs = (design.faq as any[]).filter(faq => faq.answer === "");
          if (unansweredFaqs.length > 0) {
            return {
              ...design,
              faq: unansweredFaqs
            };
          }
        }
        return null;
      })
      .filter(Boolean);

    return NextResponse.json(designsWithUnansweredFaqs);
  } catch (error) {
    console.error("Failed to fetch unanswered FAQs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
