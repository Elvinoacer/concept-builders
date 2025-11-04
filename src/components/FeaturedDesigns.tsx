"use client";
import { Design } from "@/generated/prisma";
import DesignCard from "./design-showcase/DesignCard";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface DesignWithCategoryAndFiles extends Design {
  category: { name: string } | null;
  files: { url: string }[];
  images: { url: string }[];
}

interface FeaturedDesignsProps {
  featuredDesigns: DesignWithCategoryAndFiles[];
}

const FeaturedDesigns = ({ featuredDesigns }: FeaturedDesignsProps) => {
  const router = useRouter();
  if (!featuredDesigns || featuredDesigns.length === 0) {
    return null;
  }

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

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 -left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 -right-10 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-4">
            Featured Designs
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore our handpicked selection of exceptional architectural
            designs that showcase innovation and excellence
          </p>
        </motion.div>

        {/* Designs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 lg:gap-12"
        >
          {featuredDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              variants={{
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
              }}
              whileHover={{
                y: -8,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                },
              }}
              className="group relative"
            >
              {/* Featured Badge for First 2 Items */}
              {index < 2 && (
                <div className="absolute -top-2 -left-2 z-20">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-lg flex items-center">
                    <span className="material-symbols-outlined text-xs mr-1">
                      {index === 0 ? "star" : "favorite"}
                    </span>
                    {index === 0 ? "Editor's Pick" : "Most Loved"}
                  </div>
                </div>
              )}

              {/* Design Card */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-300/50 dark:group-hover:border-cyan-400/30">
                <DesignCard
                  key={design.id}
                  design={design}
                  index={index}
                  showDetails={false}
                />

                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              </div>

              {/* Background Glow on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 md:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-8 md:p-10 border border-blue-200/50 dark:border-blue-700/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="group"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-2">
                  {featuredDesigns.length}+
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-medium">
                  Featured Designs
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="group"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-2">
                  100+
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-medium">
                  Happy Clients
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="group"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-2">
                  50+
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-medium">
                  Design Categories
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="group"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-2">
                  4.9★
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-medium">
                  Client Rating
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200/60 dark:border-gray-700/50">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Find Your Perfect Design?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Browse our complete collection of architectural designs or get a
              custom design tailored to your vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  router.push("/design-showcase");
                }}
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/cta"
              >
                Explore All Designs
                <span className="material-symbols-outlined ml-3 text-xl group-hover/cta:translate-x-1 transition-transform duration-300">
                  explore
                </span>
              </button>
              <button
                onClick={() => {
                  router.push("/custom-design");
                }}
                className="inline-flex items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 text-lg font-semibold rounded-2xl border border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/cta2"
              >
                Get Custom Design
                <span className="material-symbols-outlined ml-3 text-xl group-hover/cta2:translate-x-1 transition-transform duration-300">
                  design_services
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedDesigns;
