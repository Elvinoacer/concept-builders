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
    const [featured, byCategory, collections, ongoingProjects] = await Promise.all([
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
      prisma.ongoingProject.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
          featuredImage: true,
          clientName: true,
          location: true,
          status: true,
          category: true,
        }
      })
    ]);
    return { featured, all: byCategory, collections, ongoingProjects };
  },
  ["landing-data-v3"],
  { revalidate: 300, tags: ["landing-data", "designs", "featured-designs", "ongoing-projects"] }, // 5 minute cache + tags for on-demand revalidation
);

export default async function LandingPage() {
  const { featured, all, collections, ongoingProjects } = await getLandingData();

  return (
    <div style={{ backgroundColor: "#141414" }} className="relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `html { scroll-behavior: smooth; }`,
        }}
      />
      <div className="relative z-10">
        <DreamPlan featuredDesigns={featured.slice(0, 7)} />
        <Featured allDesigns={featured} />
        <Explorer allDesigns={all} />
        <DesignJourney />
        <SocialProof projects={ongoingProjects} />
        <DesignIdeas collections={collections} />
        <ContactForm />
      </div>
    </div>
  );
}
