"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Design } from "@/generated/prisma";
import { designDetailPageData } from "@/lib/dummydata";
import Image from "next/image";

const FloorPlan = ({
  floorPlanUrl,
  design,
  index = 0,
}: {
  floorPlanUrl: string;
  design: Design;
  index?: number;
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.2 + index * 0.3,
        ease: "easeOut",
      },
    },
  };

  const zoomVariants = {
    initial: { scale: 1 },
    zoomed: { scale: 1.5 },
    exit: { scale: 1 },
  };

  return (
    <>
      <motion.section
        className="mb-8 sm:mb-10 md:mb-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 + index * 0.3 }}
        >
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 sm:mb-2">
              {designDetailPageData.floorPlan.previewTitle}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-2">
              Detailed architectural floor plan with measurements and
              annotations
            </p>
          </div>

          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.3 }}
          >
            <motion.button
              onClick={toggleZoom}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl md:rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">
                {isZoomed ? "zoom_out" : "zoom_in"}
              </span>
              <span className="font-medium hidden xs:inline">
                {isZoomed ? "Zoom Out" : "Zoom In"}
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl border-2 border-gray-200/50 dark:border-gray-700/50 overflow-hidden group"
          variants={imageVariants}
          whileHover={{ y: -2, scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <motion.div
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-primary/20 border-t-primary rounded-full mb-2 sm:mb-3 md:mb-4 mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Loading floor plan...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {imageError && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <span className="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-gray-400 dark:text-gray-600 mb-2 sm:mb-3 md:mb-4">
                    error
                  </span>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1 sm:mb-2">
                    Failed to load floor plan
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Please try again later
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className={`w-full h-[250px] xs:h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px] bg-center bg-no-repeat bg-gray-100 dark:bg-gray-900 cursor-${isZoomed ? "zoom-out" : "zoom-in"} transition-all duration-500 ${
              isZoomed ? "bg-contain" : "bg-contain"
            }`}
            style={{ backgroundImage: `url("${floorPlanUrl}")` }}
            variants={zoomVariants}
            initial="initial"
            animate={isZoomed ? "zoomed" : "initial"}
            onClick={toggleZoom}
          />
          <img
            src={floorPlanUrl}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: "none" }}
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl md:rounded-2xl bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2"
              initial={{ opacity: 0, y: -10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              <span className="material-symbols-outlined text-sm sm:text-base md:text-lg">
                {isZoomed ? "zoom_out" : "zoom_in"}
              </span>
              <span className="hidden xs:inline">
                Click to {isZoomed ? "zoom out" : "zoom in"}
              </span>
            </motion.div>

            <motion.div
              className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl md:rounded-2xl bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm font-medium"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              Scale: 1:100
            </motion.div>

            <motion.div
              className="absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl md:rounded-2xl bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm font-medium"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              Area: {design.area} sq ft
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-4 sm:mt-6 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 + index * 0.3 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                square_foot
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Total Area
              </p>
              <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
                {design.area} sq ft
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/30">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-green-100 dark:bg-green-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm sm:text-base">
                door_front
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Bedrooms
              </p>
              <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
                {design.bedrooms}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-amber-100 dark:bg-amber-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                bathtub
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Bathrooms
              </p>
              <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
                {design.bathrooms}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 + index * 0.3 }}
        >
          <h4 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-3 md:mb-4 flex items-center gap-1 sm:gap-2">
            <span className="material-symbols-outlined text-primary text-sm sm:text-base">
              precision_manufacturing
            </span>
            Technical Specifications
          </h4>
          <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Scale</p>
              <p className="font-semibold text-slate-800 dark:text-white">
                1:100
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Format</p>
              <p className="font-semibold text-slate-800 dark:text-white">
                Vector PDF
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Dimensions</p>
              <p className="font-semibold text-slate-800 dark:text-white">
                A1 Size
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Resolution</p>
              <p className="font-semibold text-slate-800 dark:text-white">
                300 DPI
              </p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleZoom}
          >
            <motion.div
              className="relative w-full max-w-7xl h-[80vh] max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={floorPlanUrl}
                alt="Floor plan zoomed view"
                fill
                className="max-w-full max-h-[90vh] object-contain rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 70vw"
              />
              <motion.button
                onClick={toggleZoom}
                className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="material-symbols-outlined text-lg sm:text-xl md:text-2xl">
                  close
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloorPlan;
