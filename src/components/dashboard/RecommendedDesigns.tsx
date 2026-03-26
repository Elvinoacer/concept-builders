"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DesignCard from "@/components/DesignCard";
import { motion, AnimatePresence } from "framer-motion";
import ShowMoreCard from "./ShowMoreCard";
import { ChevronLeft, ChevronRight, RefreshCw, Sparkles } from "lucide-react";

interface RecommendedDesign {
  id: string;
  name: string;
  category?: string | { name?: string | null } | null;
  basePrice?: number;
  images?: Array<string | { url?: string | null; image?: string | null }>;
}

interface RecommendedDesignsProps {
  compact?: boolean;
}

const RecommendedDesigns = ({ compact = false }: RecommendedDesignsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [recommendedDesigns, setRecommendedDesigns] = useState<
    RecommendedDesign[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const getCategoryName = (design: RecommendedDesign) => {
    if (typeof design.category === "string") {
      return design.category;
    }

    return design.category?.name || "Design";
  };

  const getPreviewImageSrc = (design: RecommendedDesign): string | null => {
    const firstImage = design.images?.[0];
    const rawSrc =
      typeof firstImage === "string"
        ? firstImage
        : firstImage?.url || firstImage?.image || "";

    const src = rawSrc.trim();
    return src.length > 0 ? src : null;
  };

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchRecommendedDesigns = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/recommendations");
        const data = await response.json();
        setRecommendedDesigns(Array.isArray(data) ? data : []);
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
        "/api/dashboard/recommendations?refresh=true",
      );
      const data = await response.json();
      setRecommendedDesigns(Array.isArray(data) ? data : []);
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
    if (isTablet) return "min-w-[290px]";
    return "min-w-[280px]";
  };

  if (compact) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gold/15 p-1.5 text-gold">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-base font-semibold text-cream">Recommended</h3>
          </div>
          <motion.button
            onClick={refreshRecommendations}
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-cb-border bg-surface p-2 text-cream-dim transition hover:text-gold"
            title="Refresh recommendations"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
          </motion.button>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse border border-cb-border bg-surface"
              />
            ))}
          </div>
        )}

        {!loading && recommendedDesigns.length === 0 && (
          <div className="border border-cb-border bg-surface p-4">
            <p className="text-sm text-cream">No recommendations yet.</p>
            <p className="mt-1 text-xs text-cream-dim">
              Explore designs to unlock personalized picks.
            </p>
            <button
              onClick={() => (window.location.href = "/designs")}
              className="mt-3 w-full border border-gold/40 px-3 py-2 text-xs font-medium text-cream transition hover:border-gold hover:bg-gold/10"
            >
              Explore Designs
            </button>
          </div>
        )}

        {!loading && recommendedDesigns.length > 0 && (
          <div className="space-y-3">
            {recommendedDesigns.slice(0, 2).map((design) => {
              const previewImageSrc = getPreviewImageSrc(design);

              return (
                <Link
                  key={design.id}
                  href={`/designs/${design.id}`}
                  className="group block overflow-hidden border border-cb-border bg-surface transition hover:border-gold/50"
                >
                  <div className="relative h-28 w-full border-b border-cb-border">
                    {previewImageSrc ? (
                      <Image
                        src={previewImageSrc}
                        alt={design.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted">
                        No Preview
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="line-clamp-1 text-sm font-semibold text-cream">
                      {design.name}
                    </p>
                    <p className="text-xs text-cream-dim">
                      {getCategoryName(design)}
                      {design.basePrice
                        ? ` • $${design.basePrice.toLocaleString()}`
                        : ""}
                    </p>
                  </div>
                </Link>
              );
            })}

            <button
              onClick={() => (window.location.href = "/designs")}
              className="w-full border border-cb-border px-3 py-2 text-xs font-medium text-cream transition hover:border-gold/50 hover:bg-gold/10"
            >
              View All Designs
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mt-6 sm:mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl sm:text-2xl font-bold text-cream">
              Recommended for You
            </h3>
          </div>
          <p className="text-sm text-cream-dim">
            Curated designs based on your preferences
          </p>
        </div>

        <div className="flex items-center gap-3">
          {recommendedDesigns.length > 0 && (
            <span className="hidden sm:inline-flex px-3 py-1 bg-gold/10 text-gold text-xs font-medium rounded-full">
              {recommendedDesigns.length} New
            </span>
          )}
          <motion.button
            onClick={refreshRecommendations}
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="p-2 bg-surface border border-cb-border text-cream-dim hover:text-gold rounded-xl shadow-sm hover:shadow-md transition-all"
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
              className={`${getCardWidth()} bg-card/80 backdrop-blur-sm rounded-2xl border-2 border-cb-border p-4 animate-pulse`}
            >
              <div className="h-40 bg-surface rounded-xl mb-4"></div>
              <div className="h-6 bg-surface rounded mb-2"></div>
              <div className="h-4 bg-surface rounded w-3/4"></div>
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
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-cb-border bg-card/90 p-3 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-card"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5 text-cream" />
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
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-cb-border bg-card/90 p-3 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-card"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5 text-cream" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Scroll Indicator for Mobile */}
          {isMobile && recommendedDesigns.length > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex gap-1">
                {[1, 2, 3].map((dot) => (
                  <div key={dot} className="w-2 h-2 bg-muted rounded-full" />
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
          className="bg-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-cb-border p-6 sm:p-8 text-center"
        >
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-muted" />
          </div>
          <h4 className="text-lg font-semibold text-cream mb-2">
            No Recommendations Yet
          </h4>
          <p className="text-cream-dim text-sm mb-4 max-w-sm mx-auto">
            Browse more designs to get personalized recommendations based on
            your interests.
          </p>
          <motion.button
            onClick={() => (window.location.href = "/designs")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-ink font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
          >
            Explore Designs
          </motion.button>
        </motion.div>
      )}
    </section>
  );
};

export default RecommendedDesigns;
