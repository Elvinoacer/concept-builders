import Marquee from "@/components/Marquee";
import BlogSection from "@/components/BlogSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import BestSellingPlans from "@/components/BestSellingPlans";
import NewPlans from "@/components/NewPlans";
import Testimonials from "@/components/Testimonials";
import FeaturedDesigns from "@/components/FeaturedDesigns";
import { getLandingPageData } from "@/lib/landing-page-data";
import { getBanners } from "@/lib/banner-data";
import { getMarqueeItems } from "@/lib/marquee-data";

export default async function Home() {
  const {
    newPlans,
    bestSellingPlans,
    featuredCategories,
    recentPosts,
    testimonials,
    featuredDesigns,
  } = await getLandingPageData();
  const banners = await getBanners();
  const marqueeItems = await getMarqueeItems();

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden dark:bg-gray-950"
      style={{
        fontFamily: '"Work Sans", "Noto Sans", sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12">
          <Hero banners={banners} />

          <Marquee marqueeItems={marqueeItems} />
          <FeaturedCategories featuredCategories={featuredCategories} />
          <HowItWorks />
          <FeaturedDesigns featuredDesigns={featuredDesigns} />
          <BestSellingPlans bestSellingPlans={bestSellingPlans} />
          <NewPlans newPlans={newPlans} />
          <Testimonials testimonials={testimonials} />
          <BlogSection recentPosts={recentPosts} />
        </main>
      </div>
    </div>
  );
}
