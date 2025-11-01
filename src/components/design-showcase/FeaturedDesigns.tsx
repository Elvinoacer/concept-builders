// FeaturedDesigns.tsx - Enhanced with smooth interactions
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        const response = await fetch("/api/designs?limit=5&isFeatured=true");
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
      className="mb-16 md:mb-20"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Featured Designs
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Curated selection of exceptional architectural designs
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll(-400)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="material-symbols-outlined text-2xl">
              chevron_left
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll(400)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="material-symbols-outlined text-2xl">
              chevron_right
            </span>
          </motion.button>
        </div>
      </div>

      <div className="relative">
        <motion.div
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory overflow-x-auto pb-8 -mx-4 px-4 gap-8 scrollbar-hide touch-pan-x"
          whileInView="visible"
          initial="hidden"
          variants={containerVariants}
        >
          <AnimatePresence>
            {loading
              ? [...Array(5)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="w-[85%] sm:w-[48%] md:w-[32%] lg:w-[24%] flex-shrink-0 snap-start"
                    variants={containerVariants}
                  >
                    <DesignCardSkeleton index={index} />
                  </motion.div>
                ))
              : featuredDesigns.map((design: any, index) => (
                  <motion.div
                    key={design.id}
                    className="w-[85%] sm:w-[48%] md:w-[32%] lg:w-[24%] flex-shrink-0 snap-start"
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

        {/* Scroll progress indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{
              width: loading ? "100%" : "0%",
              transition: { duration: 2, repeat: loading ? Infinity : 0 },
            }}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedDesigns;
