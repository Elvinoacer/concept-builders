"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const DesignGallery = ({
  images,
}: {
  images: { url: string; type: string }[];
}) => {
  if (!images || images.length === 0) {
    return (
      <motion.div
        className="aspect-video sm:aspect-[4/3] rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-gray-400 dark:text-gray-600 mb-2 sm:mb-4">
            photo_library
          </span>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base md:text-lg font-medium">
            No images available
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
            Design visuals coming soon
          </p>
        </div>
      </motion.div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const currentIndex = images.findIndex(
          (img) => img.url === selectedImage.url
        );
        const nextIndex = (currentIndex + 1) % images.length;
        setDirection(1);
        setSelectedImage(images[nextIndex]);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, selectedImage, images]);

  const handleThumbnailClick = (image: { url: string; type: string }) => {
    const currentIndex = images.findIndex(
      (img) => img.url === selectedImage.url
    );
    const newIndex = images.findIndex((img) => img.url === image.url);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setSelectedImage(image);
    setIsPlaying(false);
  };

  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = images.findIndex(
      (img) => img.url === selectedImage.url
    );
    const nextIndex = (currentIndex + 1) % images.length;
    setDirection(1);
    setSelectedImage(images[nextIndex]);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    const currentIndex = images.findIndex(
      (img) => img.url === selectedImage.url
    );
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setDirection(-1);
    setSelectedImage(images[prevIndex]);
    setIsPlaying(false);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="relative aspect-video sm:aspect-[4/3] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl bg-gray-100 dark:bg-gray-800">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={selectedImage.url}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={selectedImage.url}
              alt="Design visualization"
              fill
              className="w-full h-full object-cover"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1200px) 60vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={handlePrevious}
            className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl md:text-2xl">
              chevron_left
            </span>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl md:text-2xl">
              chevron_right
            </span>
          </button>

          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2">
            <motion.button
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-primary hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
              onClick={handlePlayPauseClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="material-symbols-outlined text-xl sm:text-2xl md:text-3xl"
                animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
              >
                {isPlaying ? "pause" : "play_arrow"}
              </motion.span>
            </motion.button>
          </div>

          <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl md:rounded-2xl bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm font-medium">
            {images.findIndex((img) => img.url === selectedImage.url) + 1} /{" "}
            {images.length}
          </div>

          {selectedImage.type === "3d" && (
            <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs sm:text-sm font-medium backdrop-blur-sm flex items-center gap-1 sm:gap-2">
              <span className="material-symbols-outlined text-base sm:text-lg">
                3d_rotation
              </span>
              <span className="hidden xs:inline">3D View</span>
            </div>
          )}
        </div>
      </div>

      <motion.div
        className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 mt-4 sm:mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {images.map((image, index) => (
          <motion.button
            key={index}
            className={`relative aspect-square rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 group/thumb border-2 ${
              selectedImage.url === image.url
                ? "border-primary ring-2 sm:ring-4 ring-primary/20 shadow-lg sm:shadow-xl md:shadow-2xl scale-105"
                : "border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md"
            }`}
            onClick={() => handleThumbnailClick(image)}
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-110"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 20vw, (max-width: 1024px) 16vw, 12vw"
            />

            {selectedImage.url === image.url && (
              <motion.div
                className="absolute inset-0 bg-primary/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {image.type === "3d" && (
              <div className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xs sm:text-sm">
                  3d_rotation
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg sm:text-xl md:text-2xl">
                zoom_in
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {isPlaying && (
        <motion.div
          className="absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex space-x-0.5 sm:space-x-1">
            {[1, 2, 3].map((dot) => (
              <motion.div
                key={dot}
                className="w-1 h-1 bg-primary rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
              />
            ))}
          </div>
          <span className="text-xs text-primary font-medium">Auto-playing</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DesignGallery;
