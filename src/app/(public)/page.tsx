import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import DreamPlan from "@/components/landing/hero";
import Featured from "@/components/landing/Featured";
import Explorer from "@/components/landing/Explorer";
import DesignJourney from "@/components/landing/DesignJourney";
import SocialProof from "@/components/landing/SocialProof";
import DesignIdeas from "@/components/landing/DesignIdeas";
import ContactForm from "@/components/landing/ContactForm";

const getLandingDesigns = unstable_cache(
  async () => {
    const [featured, byCategory] = await Promise.all([
      prisma.design.findMany({
        where: { isFeatured: true },
        include: { images: true, category: true },
        orderBy: { views: "desc" },
        take: 12,
      }),
      prisma.design.findMany({
        include: { images: true, category: true },
        orderBy: { views: "desc" },
        take: 48,
      }),
    ]);
    return { featured, all: byCategory };
  },
  ["landing-designs"],
  { revalidate: 300 } // 5 minute cache
);

export default async function LandingPage() {
  const { featured, all } = await getLandingDesigns();
  return (
    <div style={{ backgroundColor: '#141414' }} className="relative">
      <style dangerouslySetInnerHTML={{ __html: `html { scroll-behavior: smooth; }` }} />
      <div className="relative z-10">
        <DreamPlan featuredDesigns={featured.slice(0, 7)} />
        <Featured allDesigns={all} />
        <Explorer allDesigns={all} />
        <DesignJourney />
        <SocialProof />
        <DesignIdeas />
        <ContactForm />
      </div>
    </div>
  );
}
