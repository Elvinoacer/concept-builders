import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import DreamPlan from "@/components/landing/hero";

const Featured = dynamic(() => import("@/components/landing/Featured"));
const Explorer = dynamic(() => import("@/components/landing/Explorer"));
const DesignJourney = dynamic(
  () => import("@/components/landing/DesignJourney"),
);
const SocialProof = dynamic(() => import("@/components/landing/SocialProof"));
const DesignIdeas = dynamic(() => import("@/components/landing/DesignIdeas"));
const ContactForm = dynamic(() => import("@/components/landing/ContactForm"));

type LandingDesignSummary = { id: string };

const getLandingData = unstable_cache(
  async () => {
    const [featured, byCategory, collections] = await Promise.all([
      prisma.design.findMany({
        where: { isFeatured: true },
        select: {
          id: true,
          name: true,
          basePrice: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          isFeatured: true,
          images: {
            where: { type: "IMAGE" },
            orderBy: { createdAt: "desc" },
            take: 4,
            select: { url: true, type: true },
          },
          category: { select: { id: true, name: true } },
          architecturalDesign: {
            select: { pdfFiles: { select: { id: true }, take: 1 } },
          },
          structuralDesign: {
            select: { pdfFiles: { select: { id: true }, take: 1 } },
          },
        },
        orderBy: { views: "desc" },
        take: 12,
      }),
      prisma.design.findMany({
        select: {
          id: true,
          name: true,
          basePrice: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          isFeatured: true,
          features: true,
          images: {
            where: { type: "IMAGE" },
            orderBy: { createdAt: "desc" },
            take: 4,
            select: { url: true, type: true },
          },
          category: { select: { id: true, name: true } },
          architecturalDesign: {
            select: { pdfFiles: { select: { id: true }, take: 1 } },
          },
          structuralDesign: {
            select: { pdfFiles: { select: { id: true }, take: 1 } },
          },
        },
        orderBy: { views: "desc" },
        take: 48,
      }),
      prisma.designCollection.findMany({
        where: { active: true },
        include: { category: true },
        orderBy: { order: "asc" },
      }),
    ]);
    return { featured, all: byCategory, collections };
  },
  ["landing-data"],
  { revalidate: 300 }, // 5 minute cache
);

export default async function LandingPage() {
  const { featured, all, collections } = await getLandingData();
  const featuredIds = new Set(
    featured.map((design: LandingDesignSummary) => design.id),
  );
  const explorerDesigns = all.filter(
    (design: LandingDesignSummary) => !featuredIds.has(design.id),
  );

  return (
    <div style={{ backgroundColor: "#141414" }} className="relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `html { scroll-behavior: smooth; }`,
        }}
      />
      <div className="relative z-10">
        <DreamPlan featuredDesigns={featured.slice(0, 7)} />
        <Featured allDesigns={all} />
        <Explorer allDesigns={explorerDesigns} />
        <DesignJourney />
        <SocialProof />
        <DesignIdeas collections={collections} />
        <ContactForm />
      </div>
    </div>
  );
}
