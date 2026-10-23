import { cache, Suspense } from "react";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import nextDynamic from "next/dynamic";
import LandingExperience, {
  LandingCatalogData,
} from "@/components/landing/LandingExperience";
import type { Prisma } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const DesignJourney = nextDynamic(
  () => import("@/components/landing/DesignJourney"),
);
const SocialProof = nextDynamic(
  () => import("@/components/landing/SocialProof"),
);
const DesignIdeas = nextDynamic(
  () => import("@/components/landing/DesignIdeas"),
);
const ContactForm = nextDynamic(
  () => import("@/components/landing/ContactForm"),
);

const designSummary = {
  id: true,
  name: true,
  basePrice: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  isFeatured: true,
  category: { select: { name: true } },
  images: {
    where: { type: "IMAGE", status: "COMPLETED", isLatest: true },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    take: 1,
    select: { url: true, type: true, name: true },
  },
} satisfies Prisma.DesignSelect;

const emptyLandingData = {
  featured: [],
  all: [],
  cinematicDesign: null,
  collections: [],
  ongoingProjects: [],
  totalDesignCount: 0,
};

// Request memoization shares the same cached lookup across the streamed sections.
const getLandingData = cache(async () => {
  try {
    return await getCachedLandingData();
  } catch (error) {
    console.error("Error fetching landing data:", error);
    return emptyLandingData;
  }
});

const getCachedLandingData = unstable_cache(
  async () => {
    const [
      featured,
      all,
      cinematicDesign,
      collections,
      ongoingProjects,
      totalDesignCount,
    ] = await Promise.all([
      prisma.design.findMany({
        where: { isFeatured: true },
        select: designSummary,
        orderBy: [{ featuredPriority: "desc" }, { views: "desc" }],
        take: 12,
      }),
      prisma.design.findMany({
        select: designSummary,
        orderBy: { views: "desc" },
        take: 48,
      }),
      prisma.design.findFirst({
        where: { name: { contains: "(CB3023)", mode: "insensitive" } },
        select: {
          ...designSummary,
          images: { ...designSummary.images, take: 8 },
        },
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
          slug: true,
          title: true,
          description: true,
          featuredImage: true,
          clientName: true,
          location: true,
          status: true,
          category: true,
        },
      }),
      prisma.design.count(),
    ]);
    return {
      featured,
      all,
      cinematicDesign,
      collections,
      ongoingProjects,
      totalDesignCount,
    };
  },
  ["landing-data-cinematic-v1"],
  {
    revalidate: 300,
    tags: ["landing-data", "designs", "featured-designs", "ongoing-projects"],
  },
);

async function CatalogExperience() {
  const data = await getLandingData();
  return (
    <LandingCatalogData
      catalog={{
        featuredDesigns: data.featured,
        allDesigns: data.all,
        cinematicDesign: data.cinematicDesign,
        totalDesignCount: data.totalDesignCount,
      }}
    />
  );
}
async function ProjectProof() {
  const data = await getLandingData();
  return <SocialProof projects={data.ongoingProjects} />;
}
async function Collections() {
  const data = await getLandingData();
  return <DesignIdeas collections={data.collections} />;
}

export default function LandingPage() {
  return (
    <div className="relative bg-[#141614]">
      <LandingExperience
        featuredDesigns={[]}
        allDesigns={[]}
        cinematicDesign={null}
        totalDesignCount={0}
      >
        <Suspense fallback={null}>
          <CatalogExperience />
        </Suspense>
      </LandingExperience>
      <DesignJourney />
      <Suspense fallback={<SocialProof projects={[]} />}>
        <ProjectProof />
      </Suspense>
      <Suspense fallback={<DesignIdeas collections={[]} />}>
        <Collections />
      </Suspense>
      <ContactForm />
    </div>
  );
}
