"use client";
import Link from "next/link";
import { Category, Design, File } from "@/generated/prisma/browser";
import { motion } from "framer-motion";
import Image from "next/image";

interface CategoryWithDesignsAndFiles extends Category {
  designs: (Design & { images: File[] })[];
  _count: { designs: number };
}

interface FeaturedCategoriesProps {
  featuredCategories: CategoryWithDesignsAndFiles[];
}

const FeaturedCategories = ({
  featuredCategories,
}: FeaturedCategoriesProps) => {
  if (!featuredCategories || featuredCategories.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 30,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
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
    <section className="relative py-8 xs:py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20 overflow-hidden">
      {/* Background Elements - Responsive scaling */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-6 xs:top-8 sm:top-10 -left-4 xs:-left-6 sm:-left-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-full blur-2xl xs:blur-3xl"></div>
        <div className="absolute bottom-6 xs:bottom-8 sm:bottom-10 -right-4 xs:-right-6 sm:-right-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-full blur-2xl xs:blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16"
        >
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-3 xs:mb-4">
            Featured Categories
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed sm:leading-normal">
            Explore our curated collection of architectural styles and design
            categories
          </p>
        </motion.div>

        {/* Categories Grid - Responsive columns */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8 xl:gap-10"
        >
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.id || index}
              variants={itemVariants}
              whileHover="hover"
              className="group relative"
            >
              <Link
                href={`/design-showcase?category=${category.name}`}
                className="block focus:outline-none focus:ring-2 xs:focus:ring-4 focus:ring-blue-500/20 rounded-xl xs:rounded-2xl"
              >
                <motion.div
                  variants={hoverVariants}
                  className="relative bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-md xs:shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-200 dark:group-hover:border-cyan-400"
                >
                  {/* Image Container */}
                  <div className="relative h-48 xs:h-52 sm:h-56 md:h-60 lg:h-64 xl:h-72 2xl:h-80 overflow-hidden">
                    <motion.div
                      variants={imageHoverVariants}
                      className="w-full h-full"
                    >
                      <Image
                        src={
                          category.designs?.[0]?.images?.[0]?.url ||
                          category.image ||
                          "/images/category-placeholder.png"
                        }
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 375px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                      />
                    </motion.div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />

                    {/* Subtle Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 opacity-50" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 text-white z-10">
                      <motion.h3
                        className="text-lg xs:text-xl sm:text-2xl font-bold mb-1 xs:mb-2 leading-tight line-clamp-2"
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {category.name}
                      </motion.h3>

                      <div className="flex items-center justify-between">
                        <motion.p
                          className="text-blue-100 dark:text-cyan-100 font-medium xs:font-semibold text-xs xs:text-sm sm:text-base flex items-center"
                          whileHover={{ x: 1 }}
                        >
                          <span className="material-symbols-outlined text-base xs:text-lg mr-1">
                            design_services
                          </span>
                          {category._count?.designs || 0} designs
                        </motion.p>

                        {/* Arrow Indicator */}
                        <motion.div
                          className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all duration-300 flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <span className="material-symbols-outlined text-white text-xs xs:text-sm">
                            arrow_forward
                          </span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Top Corner Accent */}
                    <div className="absolute top-0 right-0 w-8 h-8 xs:w-10 xs:h-10 overflow-hidden">
                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] xs:border-l-[20px] border-l-transparent border-t-[16px] xs:border-t-[20px] border-t-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>

                  {/* Bottom Accent Line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 xs:h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                    whileHover={{ opacity: 1 }}
                  />

                  {/* Very Subtle Background Glow */}
                  <div className="absolute inset-0 rounded-xl xs:rounded-2xl bg-gradient-to-r from-blue-500/2 to-cyan-400/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-8 xs:mt-10 sm:mt-12 md:mt-14 lg:mt-16"
        >
          <Link
            href="/categories"
            className="inline-flex items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold rounded-xl xs:rounded-2xl border border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 group/cta"
          >
            <span className="material-symbols-outlined mr-2 xs:mr-3 text-blue-500 text-base xs:text-lg group-hover/cta:rotate-12 transition-transform duration-300">
              explore
            </span>
            Explore All Categories
            <span className="material-symbols-outlined ml-2 xs:ml-3 text-base xs:text-lg group-hover/cta:translate-x-1 transition-transform duration-300">
              trending_flat
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
