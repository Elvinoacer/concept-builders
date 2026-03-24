"use client";
import { Design } from "@/generated/prisma/browser";
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
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-surface to-ink overflow-hidden">
      {/* Background Elements - Responsive scaling */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-6 xs:top-8 sm:top-10 -left-4 xs:-left-6 sm:-left-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-r from-gold/10 to-gold-light/10 rounded-full blur-2xl xs:blur-3xl"></div>
        <div className="absolute bottom-6 xs:bottom-8 sm:bottom-10 -right-4 xs:-right-6 sm:-right-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-r from-gold-light/10 to-gold/10 rounded-full blur-2xl xs:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-gradient-to-r from-gold/5 to-gold-light/5 rounded-full blur-2xl xs:blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24"
        >
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gold to-gold-light text-transparent bg-clip-text mb-3 xs:mb-4">
            Featured Designs
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-cream-dim max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed sm:leading-normal">
            Explore our handpicked selection of exceptional architectural
            designs that showcase innovation and excellence
          </p>
        </motion.div>

        {/* Designs Grid - Responsive columns and gaps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 xs:gap-6 sm:gap-7 md:gap-8 lg:gap-10 xl:gap-12"
        >
          {featuredDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              variants={{
                hidden: {
                  y: 40,
                  opacity: 0,
                  scale: 0.98,
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
              }}
              whileHover={{
                y: -6,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                },
              }}
              className="group relative"
            >
              {/* Featured Badge for First 2 Items - Responsive positioning */}
              {index < 2 && (
                <div className="absolute -top-1.5 xs:-top-2 -left-1.5 xs:-left-2 z-20">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 text-xs font-bold rounded-lg xs:rounded-full shadow-md xs:shadow-lg flex items-center">
                    <span className="material-symbols-outlined text-xs mr-0.5 xs:mr-1">
                      {index === 0 ? "star" : "favorite"}
                    </span>
                    <span className="hidden xs:inline">
                      {index === 0 ? "Editor's Pick" : "Most Loved"}
                    </span>
                    <span className="xs:hidden">
                      {index === 0 ? "Top" : "Loved"}
                    </span>
                  </div>
                </div>
              )}

              {/* Design Card */}
              <div className="relative bg-card rounded-xl xs:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-cb-border group-hover:border-gold/50">
                <DesignCard
                  key={design.id}
                  design={design}
                  index={index}
                  showDetails={false}
                />

                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              </div>

              {/* Background Glow on Hover */}
              <div className="absolute inset-0 rounded-xl xs:rounded-2xl bg-gradient-to-r from-gold to-gold-light opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section - Responsive grid and spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 xs:mt-12 sm:mt-14 md:mt-16 lg:mt-20"
        >
          <div className="bg-gradient-to-r from-gold/5 to-gold-light/5 rounded-xl xs:rounded-2xl p-5 xs:p-6 sm:p-7 md:p-8 lg:p-9 xl:p-10 border border-cb-border">
            <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="group"
              >
                <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold to-gold-light text-transparent bg-clip-text mb-1 xs:mb-2">
                  {featuredDesigns.length}+
                </div>
                <div className="text-cream-dim text-xs xs:text-sm sm:text-base font-medium">
                  Featured Designs
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="group"
              >
                <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold to-gold-light text-transparent bg-clip-text mb-1 xs:mb-2">
                  100+
                </div>
                <div className="text-cream-dim text-xs xs:text-sm sm:text-base font-medium">
                  Happy Clients
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="group"
              >
                <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold to-gold-light text-transparent bg-clip-text mb-1 xs:mb-2">
                  50+
                </div>
                <div className="text-cream-dim text-xs xs:text-sm sm:text-base font-medium">
                  Design Categories
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="group"
              >
                <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold to-gold-light text-transparent bg-clip-text mb-1 xs:mb-2">
                  4.9★
                </div>
                <div className="text-cream-dim text-xs xs:text-sm sm:text-base font-medium">
                  Client Rating
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section - Responsive layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-10 xs:mt-12 sm:mt-14 md:mt-16 lg:mt-20"
        >
          <div className="bg-card rounded-xl xs:rounded-2xl p-5 xs:p-6 sm:p-7 md:p-8 lg:p-10 xl:p-12 shadow-xl border border-cb-border">
            <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-cream mb-3 xs:mb-4">
              Ready to Find Your Perfect Design?
            </h3>
            <p className="text-cream-dim text-sm xs:text-base sm:text-lg mb-4 xs:mb-5 sm:mb-6 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed">
              Browse our complete collection of architectural designs or get a
              custom design tailored to your vision.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center">
              <button
                onClick={() => {
                  router.push("/design-showcase");
                }}
                className="inline-flex items-center justify-center bg-gradient-to-r from-gold to-gold-light text-ink px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold rounded-lg xs:rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 sm:hover:-translate-y-1 group/cta w-full xs:w-auto"
              >
                Explore All Designs
                <span className="material-symbols-outlined ml-2 xs:ml-3 text-lg xs:text-xl group-hover/cta:translate-x-0.5 xs:group-hover/cta:translate-x-1 transition-transform duration-300">
                  explore
                </span>
              </button>
              <button
                onClick={() => {
                  router.push("/custom-design");
                }}
                className="inline-flex items-center justify-center bg-card text-cream px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold rounded-lg xs:rounded-xl sm:rounded-2xl border border-cb-border hover:border-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 group/cta2 w-full xs:w-auto"
              >
                Get Custom Design
                <span className="material-symbols-outlined ml-2 xs:ml-3 text-lg xs:text-xl group-hover/cta2:translate-x-0.5 xs:group-hover/cta2:translate-x-1 transition-transform duration-300">
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
