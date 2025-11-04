"use client";
import Image from "next/image";
import Link from "next/link";
import { Design } from "@/generated/prisma";
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
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      y: 50,
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
        duration: 0.7,
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
    <section className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 -left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 -right-10 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-4">
            Best Selling Plans
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover our most popular and trusted architectural designs chosen
            by homeowners worldwide
          </p>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12"
        >
          {bestSellingPlans.map((design) => (
            <motion.div
              key={design.id}
              variants={cardVariants}
              whileHover="hover"
              className="group relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-300/50 dark:group-hover:border-cyan-400/30">
                {/* Best Seller Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1.5 text-sm font-bold rounded-full shadow-lg flex items-center">
                    <span className="material-symbols-outlined text-base mr-1">
                      trending_up
                    </span>
                    Best Seller
                  </div>
                </div>

                {/* Image Container */}
                <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
                  <Image
                    src={
                      design.images?.[0]?.url ||
                      "/images/category-placeholder.png"
                    }
                    alt={design.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                {/* Content */}
                <div className="relative p-6 md:p-8 z-10">
                  <div className="mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                      {design.name}
                    </h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="material-symbols-outlined text-base mr-2 text-blue-500">
                        category
                      </span>
                      <span className="text-sm md:text-base font-medium">
                        {design.category?.name || "Uncategorized"}
                      </span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-base mr-1 text-green-500">
                        visibility
                      </span>
                      <span>Popular Choice</span>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className="material-symbols-outlined text-amber-500 text-lg"
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-center"
                  >
                    <Link
                      href={`/designs/${design.id}`}
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-4 text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/btn"
                    >
                      View Details
                      <span className="material-symbols-outlined ml-2 text-lg group-hover/btn:translate-x-1 transition-transform duration-300">
                        arrow_forward
                      </span>
                    </Link>
                  </motion.div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-padding opacity-0 group-hover:opacity-100 transition-opacity duration-500 -m-0.5" />
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-500 -z-10" />
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
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-8 md:p-10 border border-blue-200/50 dark:border-blue-700/30">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Explore our complete collection of architectural designs and find
              the perfect plan for your dream home.
            </p>
            <Link
              href="/designs"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/cta"
            >
              Browse All Designs
              <span className="material-symbols-outlined ml-3 text-xl group-hover/cta:translate-x-1 transition-transform duration-300">
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
