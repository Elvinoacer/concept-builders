"use client";

import { designDetailPageData } from "@/lib/dummydata/designDetailPage";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const Renderings = ({ renderings }: { renderings: { url: string }[] }) => {
  const [selectedRendering, setSelectedRendering] = useState<number | null>(
    null
  );
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!renderings || renderings.length === 0) {
    return (
      <motion.section
        className="mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4 sm:mb-6 text-center sm:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {designDetailPageData.renderings.title}
        </motion.h2>
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center border-2 border-gray-200/50 dark:border-gray-700/50 max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Eye className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
            No Renderings Available
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-base sm:text-lg lg:text-lg max-w-md mx-auto leading-relaxed">
            3D visualizations and renderings will be available soon for this
            design.
          </p>
        </motion.div>
      </motion.section>
    );
  }

  const openRendering = (index: number) => {
    setSelectedRendering(index);
    setIsFullscreen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeRendering = () => {
    setIsFullscreen(false);
    setIsZoomed(false);
    // Restore body scroll
    document.body.style.overflow = "unset";
    setTimeout(() => setSelectedRendering(null), 300);
  };

  const nextRendering = () => {
    if (selectedRendering !== null) {
      setSelectedRendering((selectedRendering + 1) % renderings.length);
      setIsZoomed(false);
    }
  };

  const previousRendering = () => {
    if (selectedRendering !== null) {
      setSelectedRendering(
        (selectedRendering - 1 + renderings.length) % renderings.length
      );
      setIsZoomed(false);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case "Escape":
          closeRendering();
          break;
        case "ArrowLeft":
          previousRendering();
          break;
        case "ArrowRight":
          nextRendering();
          break;
        case " ":
        case "Enter":
          setIsZoomed(!isZoomed);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, isZoomed, selectedRendering]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  };

  const imageVariants = {
    normal: { scale: 1 },
    zoomed: { scale: isMobile ? 2 : 1.5 }, // More zoom on mobile for better detail viewing
  };

  return (
    <>
      <motion.section
        className="mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8"
          variants={itemVariants}
        >
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              {designDetailPageData.renderings.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-lg">
              High-quality 3D visualizations and architectural renderings
            </p>
          </div>
          <motion.div
            className="px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-primary/10 text-primary font-semibold text-sm sm:text-base text-center sm:text-right mx-auto sm:mx-0 w-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {renderings.length}{" "}
            {renderings.length === 1 ? "Rendering" : "Renderings"}
          </motion.div>
        </motion.div>

        {/* Renderings Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
        >
          {renderings.map((rendering, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={!isMobile ? "hover" : undefined} // Disable hover effects on mobile
              className="group relative cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-primary/30 transition-all duration-500 active:scale-95"
              onClick={() => openRendering(index)}
            >
              {/* Rendering Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
                <Image
                  src={rendering.url}
                  alt={`3D Rendering ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                  priority={index < 3} // Prioritize loading first 3 images
                  quality={95}
                />

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: isMobile ? 0 : 1 }} // Show overlay on hover only for desktop
                >
                  {/* View Button */}
                  <motion.div
                    className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl text-slate-800 dark:text-white font-semibold text-xs sm:text-sm">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      View Full Screen
                    </div>
                  </motion.div>

                  {/* Rendering Number */}
                  <motion.div
                    className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2 sm:px-3 py-1 rounded-xl sm:rounded-2xl bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                  >
                    Rendering {index + 1}
                  </motion.div>
                </motion.div>
              </div>

              {/* Info Footer */}
              <motion.div
                className="p-3 sm:p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                    3D Visualization
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 hidden sm:block">
                    Click to view
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Technical Info */}
        <motion.div
          className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
        >
          <motion.div
            className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30"
            variants={itemVariants}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl sm:text-2xl">
                high_quality
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
                4K Resolution
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                Ultra-high definition
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/30"
            variants={itemVariants}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 dark:bg-green-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl sm:text-2xl">
                light_mode
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
                Realistic Lighting
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                Natural light simulation
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/30"
            variants={itemVariants}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-xl sm:text-2xl">
                texture
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
                HD Textures
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                Photorealistic materials
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isFullscreen && selectedRendering !== null && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            {/* Navigation Arrows - Hidden on very small screens, smaller on mobile */}
            {!isMobile && (
              <>
                <motion.button
                  onClick={previousRendering}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>

                <motion.button
                  onClick={nextRendering}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </>
            )}

            {/* Close Button */}
            <motion.button
              onClick={closeRendering}
              className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close viewer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Zoom Control */}
            <motion.button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? (
                <ZoomOut className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </motion.button>

            {/* Image Counter */}
            <motion.div
              className="absolute top-2 sm:top-3 lg:top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-xs sm:text-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {selectedRendering + 1} / {renderings.length}
            </motion.div>

            {/* Mobile Swipe Instructions */}
            {isMobile && (
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Swipe to navigate • Tap to zoom
              </motion.div>
            )}

            {/* Main Image Container */}
            <motion.div
              className="relative w-full h-full max-w-full max-h-full flex items-center justify-center cursor-zoom-in touch-pan-y"
              variants={imageVariants}
              animate={isZoomed ? "zoomed" : "normal"}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => setIsZoomed(!isZoomed)}
              // Add swipe gestures for mobile
              onPanEnd={(e, info) => {
                if (!isMobile || isZoomed) return;

                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold) {
                  nextRendering();
                } else if (info.offset.x > swipeThreshold) {
                  previousRendering();
                }
              }}
            >
              <Image
                src={renderings[selectedRendering].url}
                alt={`3D Rendering ${selectedRendering + 1}`}
                fill
                className="object-contain select-none"
                sizes="100vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                priority
                quality={95}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Renderings;
