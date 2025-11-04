"use client";
import Link from "next/link";
import { Category, Design, File } from "@/generated/prisma";
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
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 40,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
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
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <section className="relative py-12 md:py-16 lg:py-20 xl:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 -left-10 w-60 h-60 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 -right-10 w-60 h-60 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-4">
            Featured Categories
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore our curated collection of architectural styles and design
            categories
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10"
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
                className="block focus:outline-none focus:ring-4 focus:ring-blue-500/20 rounded-2xl"
              >
                <motion.div
                  variants={hoverVariants}
                  className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-300/50 dark:group-hover:border-cyan-400/30"
                >
                  {/* Image Container */}
                  <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden">
                    <Image
                      src={
                        category.designs?.[0]?.images?.[0]?.url ||
                        category.image ||
                        "/images/category-placeholder.png"
                      }
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white z-10">
                      <motion.h3
                        className="text-xl md:text-2xl font-bold mb-2 leading-tight"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {category.name}
                      </motion.h3>

                      <div className="flex items-center justify-between">
                        <motion.p
                          className="text-blue-200 dark:text-cyan-200 font-semibold text-sm md:text-base flex items-center"
                          whileHover={{ x: 3 }}
                        >
                          <span className="material-symbols-outlined text-lg mr-1">
                            design_services
                          </span>
                          {category._count?.designs || 0} designs
                        </motion.p>

                        {/* Arrow Indicator */}
                        <motion.div
                          className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <span className="material-symbols-outlined text-white text-sm">
                            arrow_forward
                          </span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-padding opacity-0 group-hover:opacity-100 transition-opacity duration-500 -m-0.5" />
                  </div>

                  {/* Background Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-500 -z-10" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <Link
            href="/categories"
            className="inline-flex items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 text-lg font-semibold rounded-2xl border border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/cta"
          >
            <span className="material-symbols-outlined mr-3 text-blue-500 group-hover/cta:rotate-12 transition-transform duration-300">
              explore
            </span>
            Explore All Categories
            <span className="material-symbols-outlined ml-3 text-lg group-hover/cta:translate-x-1 transition-transform duration-300">
              trending_flat
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
