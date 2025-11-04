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
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      y: 60,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.7,
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -6,
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
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 -left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 -right-10 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-4">
            New & Featured Plans
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover our latest architectural innovations and trending designs
            that redefine modern living
          </p>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-6xl mx-auto"
        >
          {newPlans.map((design, index) => (
            <motion.div
              key={design.id}
              variants={cardVariants}
              whileHover="hover"
              className="group relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-200 dark:group-hover:border-cyan-400">
                {/* New Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg flex items-center">
                    <span className="material-symbols-outlined text-base mr-2">
                      new_releases
                    </span>
                    New
                  </div>
                </div>

                {/* Featured Badge for First Item */}
                {index === 0 && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg flex items-center">
                      <span className="material-symbols-outlined text-base mr-2">
                        star
                      </span>
                      Featured
                    </div>
                  </div>
                )}

                {/* Image Container */}
                <div className="relative h-80 sm:h-96 w-full overflow-hidden">
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
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={index < 2}
                    />
                  </motion.div>

                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-200 border border-white/20 shadow-lg">
                      {design.category?.name || "Uncategorized"}
                    </div>
                  </div>

                  {/* Subtle Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 opacity-60" />
                </div>

                {/* Content */}
                <div className="relative p-8 md:p-10 z-10">
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                      {design.name}
                    </h3>

                    {/* Design Features */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                        <span className="material-symbols-outlined text-base mr-1.5 text-blue-500">
                          schedule
                        </span>
                        Latest Design
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                        <span className="material-symbols-outlined text-base mr-1.5 text-green-500">
                          trending_up
                        </span>
                        Trending
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-center"
                  >
                    <Link
                      href={`/designs/${design.id}`}
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                    >
                      Explore Design
                      <span className="material-symbols-outlined ml-3 text-xl group-hover/btn:translate-x-1 transition-transform duration-300">
                        arrow_forward
                      </span>
                    </Link>
                  </motion.div>
                </div>

                {/* Subtle Corner Accent */}
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[24px] border-l-transparent border-t-[24px] border-t-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Bottom Accent Line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                  whileHover={{ opacity: 1 }}
                />
              </div>

              {/* Very Subtle Background Glow */}
              <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-500/3 to-cyan-400/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-8 md:p-12 border border-blue-200/50 dark:border-blue-700/30">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Ahead with New Designs
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Be the first to explore our latest architectural innovations and
              get inspired by cutting-edge designs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/designs?sort=newest"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/cta"
              >
                View All New Designs
                <span className="material-symbols-outlined ml-3 text-xl group-hover/cta:translate-x-1 transition-transform duration-300">
                  trending_flat
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 text-lg font-semibold rounded-2xl border border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/cta2"
              >
                Get Custom Design
                <span className="material-symbols-outlined ml-3 text-xl group-hover/cta2:translate-x-1 transition-transform duration-300">
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
