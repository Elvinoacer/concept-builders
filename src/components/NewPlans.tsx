"use client";
import Image from "next/image";
import Link from "next/link";
import { Design } from "@/generated/prisma";
import { motion } from "framer-motion";

interface NewPlansProps {
  newPlans: (Design & {
    images: { url: string }[];
    category: { name: string } | null;
  })[];
}

const NewPlans = ({ newPlans }: NewPlansProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: {
      y: 40,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const imageHoverVariants = {
    hover: {
      scale: 1.04,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Elements - Responsive scaling */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-6 xs:top-8 sm:top-10 -left-4 xs:-left-6 sm:-left-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full blur-2xl xs:blur-3xl"></div>
        <div className="absolute bottom-6 xs:bottom-8 sm:bottom-10 -right-4 xs:-right-6 sm:-right-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl xs:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-full blur-2xl xs:blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24"
        >
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-3 xs:mb-4">
            New & Featured Plans
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed sm:leading-normal">
            Discover our latest architectural innovations and trending designs
            that redefine modern living
          </p>
        </motion.div>

        {/* Plans Grid - Responsive columns and gaps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-7 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 max-w-full lg:max-w-6xl mx-auto"
        >
          {newPlans.map((design, index) => (
            <motion.div
              key={design.id}
              variants={cardVariants}
              whileHover="hover"
              className="group relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-200 dark:group-hover:border-cyan-400">
                {/* New Badge - Responsive sizing */}
                <div className="absolute top-3 xs:top-4 left-3 xs:left-4 z-20">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 text-xs xs:text-sm font-bold rounded-lg xs:rounded-full shadow-md xs:shadow-lg flex items-center">
                    <span className="material-symbols-outlined text-xs xs:text-sm mr-1 xs:mr-2">
                      new_releases
                    </span>
                    <span className="hidden xs:inline">New</span>
                    <span className="xs:hidden">New</span>
                  </div>
                </div>

                {/* Featured Badge for First Item - Responsive positioning */}
                {index === 0 && (
                  <div className="absolute top-3 xs:top-4 right-3 xs:right-4 z-20">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 text-xs xs:text-sm font-bold rounded-lg xs:rounded-full shadow-md xs:shadow-lg flex items-center">
                      <span className="material-symbols-outlined text-xs xs:text-sm mr-1 xs:mr-2">
                        star
                      </span>
                      <span className="hidden xs:inline">Featured</span>
                      <span className="xs:hidden">Top</span>
                    </div>
                  </div>
                )}

                {/* Image Container - Responsive heights */}
                <div className="relative h-60 xs:h-64 sm:h-72 md:h-80 lg:h-96 w-full overflow-hidden">
                  <motion.div
                    variants={imageHoverVariants}
                    className="w-full h-full"
                  >
                    <Image
                      src={
                        design.images?.[0]?.url ||
                        "/images/category-placeholder.png"
                      }
                      alt={design.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 320px) 100vw, (max-width: 480px) 100vw, (max-width: 1024px) 100vw, 50vw"
                      priority={index < 2}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                    />
                  </motion.div>

                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                  {/* Category Badge - Responsive sizing */}
                  <div className="absolute bottom-3 xs:bottom-4 left-3 xs:left-4 z-20">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-lg xs:rounded-xl text-xs xs:text-sm font-semibold text-gray-800 dark:text-gray-200 border border-white/20 shadow-md xs:shadow-lg line-clamp-1">
                      {design.category?.name || "Uncategorized"}
                    </div>
                  </div>

                  {/* Subtle Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 opacity-60" />
                </div>

                {/* Content - Responsive padding */}
                <div className="relative p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 z-10">
                  <div className="mb-4 xs:mb-5 sm:mb-6">
                    <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4 leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                      {design.name}
                    </h3>

                    {/* Design Features - Responsive layout */}
                    <div className="flex flex-wrap gap-2 xs:gap-3 mb-3 xs:mb-4">
                      <div className="flex items-center text-xs xs:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 xs:px-3 py-1 xs:py-1.5 sm:py-2 rounded-md xs:rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                        <span className="material-symbols-outlined text-xs xs:text-sm mr-1 xs:mr-1.5 text-blue-500">
                          schedule
                        </span>
                        <span className="hidden xs:inline">Latest Design</span>
                        <span className="xs:hidden">Latest</span>
                      </div>
                      <div className="flex items-center text-xs xs:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 xs:px-3 py-1 xs:py-1.5 sm:py-2 rounded-md xs:rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                        <span className="material-symbols-outlined text-xs xs:text-sm mr-1 xs:mr-1.5 text-green-500">
                          trending_up
                        </span>
                        <span className="hidden xs:inline">Trending</span>
                        <span className="xs:hidden">Trend</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button - Responsive sizing */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-center"
                  >
                    <Link
                      href={`/designs/${design.id}`}
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold rounded-lg xs:rounded-xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                    >
                      Explore Design
                      <span className="material-symbols-outlined ml-2 xs:ml-3 text-base xs:text-lg sm:text-xl group-hover/btn:translate-x-0.5 xs:group-hover/btn:translate-x-1 transition-transform duration-300">
                        arrow_forward
                      </span>
                    </Link>
                  </motion.div>
                </div>

                {/* Subtle Corner Accent - Responsive sizing */}
                <div className="absolute top-0 right-0 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 overflow-hidden">
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] xs:border-l-[20px] sm:border-l-[24px] border-l-transparent border-t-[16px] xs:border-t-[20px] sm:border-t-[24px] border-t-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Bottom Accent Line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 xs:h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                  whileHover={{ opacity: 1 }}
                />
              </div>

              {/* Very Subtle Background Glow */}
              <div className="absolute inset-0 rounded-xl xs:rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-500/3 to-cyan-400/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section - Responsive layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-10 xs:mt-12 sm:mt-14 md:mt-16 lg:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl xs:rounded-2xl p-5 xs:p-6 sm:p-7 md:p-8 lg:p-10 xl:p-12 border border-blue-200/50 dark:border-blue-700/30">
            <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4">
              Stay Ahead with New Designs
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base sm:text-lg mb-4 xs:mb-5 sm:mb-6 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed">
              Be the first to explore our latest architectural innovations and
              get inspired by cutting-edge designs.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center">
              <Link
                href="/designs?sort=newest"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold rounded-lg xs:rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 group/cta w-full xs:w-auto"
              >
                View All New Designs
                <span className="material-symbols-outlined ml-2 xs:ml-3 text-lg xs:text-xl group-hover/cta:translate-x-0.5 xs:group-hover/cta:translate-x-1 transition-transform duration-300">
                  trending_flat
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold rounded-lg xs:rounded-xl sm:rounded-2xl border border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 group/cta2 w-full xs:w-auto"
              >
                Get Custom Design
                <span className="material-symbols-outlined ml-2 xs:ml-3 text-lg xs:text-xl group-hover/cta2:translate-x-0.5 xs:group-hover/cta2:translate-x-1 transition-transform duration-300">
                  design_services
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewPlans;
