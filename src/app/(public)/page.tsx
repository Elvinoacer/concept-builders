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
      {/* Background Elements - Responsive scaling */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient Orbs - Responsive positioning and sizing */}
        <div className="absolute -top-20 -right-16 w-48 h-48 sm:-top-28 sm:-right-20 sm:w-56 sm:h-56 md:-top-32 md:-right-24 md:w-64 md:h-64 lg:-top-40 lg:-right-28 lg:w-72 lg:h-72 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full blur-2xl sm:blur-3xl dark:from-blue-600/10 dark:to-cyan-400/10"></div>
        <div className="absolute -bottom-20 -left-16 w-48 h-48 sm:-bottom-28 sm:-left-20 sm:w-56 sm:h-56 md:-bottom-32 md:-left-24 md:w-64 md:h-64 lg:-bottom-40 lg:-left-28 lg:w-72 lg:h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl sm:blur-3xl dark:from-cyan-400/10 dark:to-blue-600/10"></div>

        {/* Grid Pattern - Responsive sizing */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:48px_48px] md:bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
      </div>

      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 space-y-12 sm:space-y-14 md:space-y-16 lg:space-y-20 xl:space-y-24">
          {/* Hero Section */}
          <section className="relative">
            <Hero banners={banners} />
          </section>

          {/* Marquee Section */}
          <section className="relative">
            <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xs sm:shadow-sm">
              <Marquee marqueeItems={marqueeItems} />
            </div>
          </section>

          {/* Featured Categories */}
          <section className="relative">
            <FeaturedCategories featuredCategories={featuredCategories} />
          </section>

          {/* How It Works */}
          <section className="relative">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-md sm:shadow-lg">
              <HowItWorks />
            </div>
          </section>

          {/* Featured Designs */}
          <section className="relative">
            <FeaturedDesigns featuredDesigns={featuredDesigns} />
          </section>

          {/* Best Selling Plans */}
          <section className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 border border-blue-200/50 dark:border-blue-700/30 shadow-md sm:shadow-lg">
              <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14">
                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-2 sm:mb-3 md:mb-4">
                  Best Selling Plans
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base sm:text-lg md:text-xl max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto leading-relaxed sm:leading-normal">
                  Join thousands of satisfied customers with our most popular
                  plans
                </p>
              </div>
              <BestSellingPlans bestSellingPlans={bestSellingPlans} />
            </div>
          </section>

          {/* New Plans */}
          <section className="relative">
            <NewPlans newPlans={newPlans} />
          </section>

          {/* Testimonials */}
          <section className="relative">
            <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14">
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-2 sm:mb-3 md:mb-4">
                What Our Clients Say
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base sm:text-lg md:text-xl max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto leading-relaxed sm:leading-normal">
                Real stories from architects and designers who trust our
                solutions
              </p>
            </div>
            <Testimonials testimonials={testimonials} />
          </section>

          {/* Blog Section */}
          <section className="relative">
            <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14">
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-2 sm:mb-3 md:mb-4">
                Latest Insights
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base sm:text-lg md:text-xl max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto leading-relaxed sm:leading-normal">
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
