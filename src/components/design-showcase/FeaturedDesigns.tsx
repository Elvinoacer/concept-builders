"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DesignCard from "./DesignCard";
import DesignCardSkeleton from "./DesignCardSkeleton";

const FeaturedDesigns = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [featuredDesigns, setFeaturedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "/api/designs?limit=12&isFeatured=true&mode=cursor&includeTotals=false&lite=true",
        );
        const data = await response.json();
        setFeaturedDesigns(data.designs);
      } catch (error) {
        console.error("Error fetching featured designs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const scroll = async (scrollOffset: number) => {
    if (scrollContainerRef.current && !isScrolling) {
      setIsScrolling(true);
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
      setTimeout(() => setIsScrolling(false), 500);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-12 border border-cb-border bg-[rgba(10,9,7,0.45)] p-4 sm:mb-16 sm:p-6 md:mb-20 lg:p-8"
    >
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-8 sm:mb-12 gap-4">
        <div className="flex-1 min-w-0">
          <p className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-7 bg-gold" />
            Curated Collection
          </p>
          <h2
            className="mb-3 text-[clamp(34px,5vw,58px)] font-light leading-[1.05] text-cream"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            Featured Designs
          </h2>
          <p className="max-w-2xl text-sm leading-[1.75] text-cream-dim sm:text-base">
            A refined selection of standout concepts with practical layouts,
            beautiful facades, and build-ready documentation.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Link
            href="/designs?isFeatured=true"
            className="order-last border border-[rgba(200,137,42,0.34)] px-4 py-2.5 text-center text-[10px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-[rgba(200,137,42,0.1)] sm:order-first"
          >
            See all featured
          </Link>
          <div className="hidden sm:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll(-400)}
              className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center border border-cb-border bg-surface text-gold transition-all duration-300 hover:border-gold/40 hover:text-gold-light"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl">
                chevron_left
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll(400)}
              className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center border border-cb-border bg-surface text-gold transition-all duration-300 hover:border-gold/40 hover:text-gold-light"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl">
                chevron_right
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="relative">
        <motion.div
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory overflow-x-auto pb-6 -mx-3 xs:-mx-4 px-3 xs:px-4 gap-4 sm:gap-6 md:gap-8 scrollbar-hide touch-pan-x"
          whileInView="visible"
          initial="hidden"
          variants={containerVariants}
        >
          <AnimatePresence>
            {loading
              ? [...Array(5)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="w-[85%] xs:w-[75%] sm:w-[48%] md:w-[32%] lg:w-[24%] xl:w-[20%] flex-shrink-0 snap-start"
                    variants={containerVariants}
                  >
                    <DesignCardSkeleton index={index} />
                  </motion.div>
                ))
              : featuredDesigns.map((design: any, index) => (
                  <motion.div
                    key={design.id}
                    className="w-[85%] xs:w-[75%] sm:w-[48%] md:w-[32%] lg:w-[24%] xl:w-[20%] flex-shrink-0 snap-start"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <DesignCard
                      design={design}
                      index={index}
                      showDetails={false}
                    />
                  </motion.div>
                ))}
          </AnimatePresence>
        </motion.div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 sm:w-48 h-1.5 bg-surface rounded-full overflow-hidden border border-cb-border">
          <motion.div
            className="h-full bg-gold"
            animate={{
              width: loading ? "100%" : "0%",
              x: loading ? ["-100%", "100%"] : 0,
              transition: {
                duration: 1.5,
                repeat: loading ? Infinity : 0,
                ease: "easeInOut",
              },
            }}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedDesigns;
