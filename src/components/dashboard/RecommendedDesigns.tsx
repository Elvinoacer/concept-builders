"use client";
import React, { useRef, useState, useEffect } from "react";
import DesignCard from "@/components/DesignCard";
import { motion, AnimatePresence } from "framer-motion";
import ShowMoreCard from "./ShowMoreCard";
import { ChevronLeft, ChevronRight, RefreshCw, Sparkles } from "lucide-react";

const RecommendedDesigns = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [recommendedDesigns, setRecommendedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScrollability);

    return () => window.removeEventListener("resize", checkScrollability);
  }, []);

  useEffect(() => {
    const fetchRecommendedDesigns = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/recommendations");
        const data = await response.json();
        setRecommendedDesigns(data);
      } catch (error) {
        console.error("Error fetching recommended designs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedDesigns();
  }, []);

  const checkScrollability = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = isMobile ? 280 : 320;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const refreshRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/dashboard/recommendations?refresh=true"
      );
      const data = await response.json();
      setRecommendedDesigns(data);
    } catch (error) {
      console.error("Error refreshing recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScrollability();
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(el);
      return () => resizeObserver.unobserve(el);
    }
  }, [recommendedDesigns]);

  // Calculate card width based on screen size
  const getCardWidth = () => {
    if (isMobile) return "min-w-[280px]";
    if (isTablet) return "min-w-[300px]";
    return "min-w-[320px]";
  };

  return (
    <section className="mt-6 sm:mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Recommended for You
            </h3>
          </div>
          {recommendedDesigns.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
              {recommendedDesigns.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={refreshRecommendations}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200"
            title="Refresh recommendations"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </motion.button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex overflow-x-auto space-x-4 pb-6 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${getCardWidth()} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 p-4 animate-pulse`}
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {!loading && (
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={checkScrollability}
            className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-6 scrollbar-hide -mx-2 px-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {recommendedDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${getCardWidth()} flex-shrink-0`}
              >
                <DesignCard design={design} />
              </motion.div>
            ))}

            {/* Show More Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: recommendedDesigns.length * 0.1 }}
              className={`${getCardWidth()} flex-shrink-0`}
            >
              <ShowMoreCard />
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <AnimatePresence>
            {canScrollLeft && !isMobile && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scroll("left")}
                className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 rounded-full shadow-xl z-10 hover:bg-white dark:hover:bg-gray-900 border-2 border-gray-200/50 dark:border-gray-700/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {canScrollRight && !isMobile && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scroll("right")}
                className="absolute top-1/2 -translate-y-1/2 -right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 rounded-full shadow-xl z-10 hover:bg-white dark:hover:bg-gray-900 border-2 border-gray-200/50 dark:border-gray-700/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Scroll Indicator for Mobile */}
          {isMobile && recommendedDesigns.length > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex gap-1">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && recommendedDesigns.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Recommendations Yet
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 max-w-sm mx-auto">
            Browse more designs to get personalized recommendations based on
            your interests.
          </p>
          <motion.button
            onClick={() => (window.location.href = "/designs")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
          >
            Explore Designs
          </motion.button>
        </motion.div>
      )}
    </section>
  );
};

export default RecommendedDesigns;
