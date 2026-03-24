"use client";
import Image from "next/image";
import Link from "next/link";
import { Design } from "@/generated/prisma/browser";
import { motion } from "framer-motion";

interface BestSellingPlansProps {
  bestSellingPlans: (Design & {
    images: { url: string }[];
    category: { name: string } | null;
  })[];
}

const BestSellingPlans = ({ bestSellingPlans }: BestSellingPlansProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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
      scale: 1.05,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Elements - Responsive scaling */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-6 xs:top-8 sm:top-10 -left-4 xs:-left-6 sm:-left-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full blur-2xl xs:blur-3xl"></div>
        <div className="absolute bottom-6 xs:bottom-8 sm:bottom-10 -right-4 xs:-right-6 sm:-right-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl xs:blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16 xl:mb-20"
        >
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-3 xs:mb-4">
            Best Selling Plans
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed sm:leading-normal">
            Discover our most popular and trusted architectural designs chosen
            by homeowners worldwide
          </p>
        </motion.div>

        {/* Plans Grid - Responsive columns and gaps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 sm:gap-7 md:gap-8 lg:gap-10 xl:gap-12"
        >
          {bestSellingPlans.map((design) => (
            <motion.div
              key={design.id}
              variants={cardVariants}
              whileHover="hover"
              className="group relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-200 dark:group-hover:border-cyan-400">
                {/* Best Seller Badge - Responsive sizing */}
                <div className="absolute top-3 xs:top-4 left-3 xs:left-4 z-20">
                  <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-2 xs:px-3 py-1 xs:py-1.5 text-xs xs:text-sm font-bold rounded-lg xs:rounded-full shadow-md xs:shadow-lg flex items-center">
                    <span className="material-symbols-outlined text-xs xs:text-sm mr-1">
                      trending_up
                    </span>
                    <span className="hidden xs:inline">Best Seller</span>
                    <span className="xs:hidden">Top</span>
                  </div>
                </div>

                {/* Image Container - Responsive heights */}
                <div className="relative h-48 xs:h-52 sm:h-56 md:h-60 lg:h-64 xl:h-72 w-full overflow-hidden">
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
                      sizes="(max-width: 320px) 100vw, (max-width: 480px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                    />
                  </motion.div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                  {/* Subtle Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 opacity-50" />

                  {/* Top Corner Accent - Responsive sizing */}
                  <div className="absolute top-0 right-0 w-8 h-8 xs:w-10 xs:h-10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] xs:border-l-[20px] border-l-transparent border-t-[16px] xs:border-t-[20px] border-t-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Content - Responsive padding */}
                <div className="relative p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 z-10">
                  <div className="mb-3 xs:mb-4">
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 xs:mb-2 leading-tight line-clamp-2">
                      {design.name}
                    </h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="material-symbols-outlined text-sm xs:text-base mr-1 xs:mr-2 text-blue-500">
                        category
                      </span>
                      <span className="text-xs xs:text-sm sm:text-base font-medium line-clamp-1">
                        {design.category?.name || "Uncategorized"}
                      </span>
                    </div>
                  </div>

                  {/* Stats Row - Responsive layout */}
                  <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6">
                    <div className="flex items-center text-xs xs:text-sm text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-sm xs:text-base mr-1 text-green-500">
                        visibility
                      </span>
                      <span className="hidden xs:inline">Popular Choice</span>
                      <span className="xs:hidden">Popular</span>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className="material-symbols-outlined text-amber-500 text-sm xs:text-base sm:text-lg"
                        >
                          star
                        </span>
                      ))}
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
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold rounded-lg xs:rounded-xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                    >
                      View Details
                      <span className="material-symbols-outlined ml-1 xs:ml-2 text-base xs:text-lg group-hover/btn:translate-x-0.5 xs:group-hover/btn:translate-x-1 transition-transform duration-300">
                        arrow_forward
                      </span>
                    </Link>
                  </motion.div>
                </div>

                {/* Bottom Accent Line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 xs:h-1 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                  whileHover={{ opacity: 1 }}
                />

                {/* Very Subtle Background Glow */}
                <div className="absolute inset-0 rounded-xl xs:rounded-2xl bg-gradient-to-r from-amber-500/2 to-yellow-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section - Responsive padding and sizing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-8 xs:mt-10 sm:mt-12 md:mt-14 lg:mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl xs:rounded-2xl p-5 xs:p-6 sm:p-7 md:p-8 lg:p-9 xl:p-10 border border-blue-200/50 dark:border-blue-700/30">
            <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base sm:text-lg mb-4 xs:mb-5 sm:mb-6 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed">
              Explore our complete collection of architectural designs and find
              the perfect plan for your dream home.
            </p>
            <Link
              href="/designs"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold rounded-lg xs:rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 group/cta w-full xs:w-auto"
            >
              Browse All Designs
              <span className="material-symbols-outlined ml-2 xs:ml-3 text-lg xs:text-xl group-hover/cta:translate-x-0.5 xs:group-hover/cta:translate-x-1 transition-transform duration-300">
                explore
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellingPlans;
