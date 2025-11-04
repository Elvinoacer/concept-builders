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
      className="relative flex h-auto min-h-screen w-full flex-col bg-white dark:bg-gray-950 overflow-x-hidden transition-colors duration-300"
      style={{
        fontFamily: '"Work Sans", "Noto Sans", sans-serif',
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-28 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl dark:from-blue-600/10 dark:to-cyan-400/10"></div>
        <div className="absolute -bottom-40 -left-28 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl dark:from-cyan-400/10 dark:to-blue-600/10"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
      </div>

      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-10 lg:py-14 space-y-16 md:space-y-20 lg:space-y-24">
          {/* Hero Section */}
          <section className="relative">
            <Hero banners={banners} />
          </section>

          {/* Marquee Section */}
          <section className="relative">
            <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4 md:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <Marquee marqueeItems={marqueeItems} />
            </div>
          </section>

          {/* Featured Categories */}
          <section className="relative">
            <FeaturedCategories featuredCategories={featuredCategories} />
          </section>

          {/* How It Works */}
          <section className="relative">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl p-6 md:p-8 lg:p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <HowItWorks />
            </div>
          </section>

          {/* Featured Designs */}
          <section className="relative">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-3">
                Featured Designs
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                Discover our most popular and innovative design solutions
              </p>
            </div>
            <FeaturedDesigns featuredDesigns={featuredDesigns} />
          </section>

          {/* Best Selling Plans */}
          <section className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-3xl p-6 md:p-8 lg:p-12 border border-blue-200/50 dark:border-blue-700/30 shadow-lg">
              <div className="text-center mb-10 md:mb-14">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-3">
                  Best Selling Plans
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                  Join thousands of satisfied customers with our most popular
                  plans
                </p>
              </div>
              <BestSellingPlans bestSellingPlans={bestSellingPlans} />
            </div>
          </section>

          {/* New Plans */}
          <section className="relative">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-3">
                New & Updated Plans
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                Fresh designs and updated solutions for modern needs
              </p>
            </div>
            <NewPlans newPlans={newPlans} />
          </section>

          {/* Testimonials */}
          <section className="relative">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl p-6 md:p-8 lg:p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="text-center mb-10 md:mb-14">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-3">
                  What Our Clients Say
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                  Real stories from architects and designers who trust our
                  solutions
                </p>
              </div>
              <Testimonials testimonials={testimonials} />
            </div>
          </section>

          {/* Blog Section */}
          <section className="relative">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-3">
                Latest Insights
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                Stay updated with the latest trends and tips in architectural
                design
              </p>
            </div>
            <BlogSection recentPosts={recentPosts} />
          </section>
        </main>
      </div>
    </div>
  );
}
