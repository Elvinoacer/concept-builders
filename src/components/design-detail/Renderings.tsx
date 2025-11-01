"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { designDetailPageData } from "@/lib/dummydata/designDetailPage";
import {
  ZoomIn,
  ZoomOut,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
} from "lucide-react";

const Renderings = ({ renderings }: { renderings: { url: string }[] }) => {
  const [selectedRendering, setSelectedRendering] = useState<number | null>(
    null
  );
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!renderings || renderings.length === 0) {
    return (
      <motion.section
        className="mb-12 md:mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {designDetailPageData.renderings.title}
        </motion.h2>
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 text-center border-2 border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Eye className="w-12 h-12 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-3">
            No Renderings Available
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-lg max-w-md mx-auto">
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
  };

  const closeRendering = () => {
    setIsFullscreen(false);
    setIsZoomed(false);
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
    zoomed: { scale: 1.5 },
  };

  return (
    <>
      <motion.section
        className="mb-12 md:mb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              {designDetailPageData.renderings.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              High-quality 3D visualizations and architectural renderings
            </p>
          </div>
          <motion.div
            className="px-4 py-2 rounded-2xl bg-primary/10 text-primary font-semibold text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {renderings.length} Renderings
          </motion.div>
        </motion.div>

        {/* Renderings Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {renderings.map((rendering, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="group relative cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-primary/30 transition-all duration-500"
              onClick={() => openRendering(index)}
            >
              {/* Rendering Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
                <Image
                  src={rendering.url}
                  alt={`3D Rendering ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {/* View Button */}
                  <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl text-slate-800 dark:text-white font-semibold text-sm">
                      <Eye className="w-4 h-4" />
                      View Full Screen
                    </div>
                  </motion.div>

                  {/* Rendering Number */}
                  <motion.div
                    className="absolute top-4 left-4 px-3 py-1 rounded-2xl bg-black/50 backdrop-blur-sm text-white text-sm font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                  >
                    Rendering {index + 1}
                  </motion.div>
                </motion.div>
              </div>

              {/* Info Footer */}
              <motion.div
                className="p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    3D Visualization
                  </span>

                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Technical Info */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          <motion.div
            className="flex items-center gap-4 p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30"
            variants={itemVariants}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
                high_quality
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">
                4K Resolution
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ultra-high definition
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4 p-6 rounded-2xl bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/30"
            variants={itemVariants}
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">
                light_mode
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">
                Realistic Lighting
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Natural light simulation
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4 p-6 rounded-2xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/30"
            variants={itemVariants}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">
                texture
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">
                HD Textures
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
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
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            {/* Navigation Arrows */}
            <motion.button
              onClick={previousRendering}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={nextRendering}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Close Button */}
            <motion.button
              onClick={closeRendering}
              className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Zoom Control */}
            <motion.button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isZoomed ? (
                <ZoomOut className="w-6 h-6" />
              ) : (
                <ZoomIn className="w-6 h-6" />
              )}
            </motion.button>

            {/* Image Counter */}
            <motion.div
              className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {selectedRendering + 1} / {renderings.length}
            </motion.div>

            {/* Main Image */}
            <motion.div
              className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center cursor-zoom-in"
              variants={imageVariants}
              animate={isZoomed ? "zoomed" : "normal"}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Image
                src={renderings[selectedRendering].url}
                alt={`3D Rendering ${selectedRendering + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </motion.div>


          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Renderings;
