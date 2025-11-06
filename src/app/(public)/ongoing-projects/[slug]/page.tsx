"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  Ruler,
  CheckCircle2,
  User,
  Workflow,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OngoingProject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  clientName: string | null;
  location: string | null;
  status: string;
  category: string;
  startDate: string | null;
  estimatedCompletionDate: string | null;
  completedAt: string | null;
  featuredImage: string | null;
  gallery: { url: string; caption: string }[];
  size: string | null;
  value: string | null;
  highlights: string[];
  published: boolean;
  createdAt: string;
}

const OngoingProjectDetailsPage = ({
  params,
}: {
  params: { slug: string };
}) => {
  const [project, setProject] = useState<OngoingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const router = useRouter();

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

  const fetchOngoingProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ongoing-projects/${params.slug}`);
      if (!response.ok) {
        throw new Error(`Failed to load project: ${response.status}`);
      }
      const data: OngoingProject = await response.json();
      setProject(data);
    } catch (err: any) {
      setError(err.message || "Project not found");
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    fetchOngoingProject();
  }, [fetchOngoingProject]);

  const openImage = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setCurrentImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!project) return;
    const images = [
      project.featuredImage,
      ...project.gallery.map((img) => img.url),
    ].filter(Boolean) as string[];
    const nextIndex = (currentImageIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
    setCurrentImageIndex(nextIndex);
  };

  const previousImage = () => {
    if (!project) return;
    const images = [
      project.featuredImage,
      ...project.gallery.map((img) => img.url),
    ].filter(Boolean) as string[];
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
    setCurrentImageIndex(prevIndex);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (e.key) {
        case "Escape":
          closeImage();
          break;
        case "ArrowLeft":
          previousImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentImageIndex, project]);

  // Animation variants
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
    hidden: { opacity: 0, y: isMobile ? 10 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"
          />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading project details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Project Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The project you are looking for does not exist."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-2xl transition-colors duration-200"
            >
              Go Back
            </button>
            <Link
              href="/ongoing-projects"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-colors duration-200 text-center"
            >
              View All Projects
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const allImages = [
    project.featuredImage,
    ...project.gallery.map((img) => img.url),
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      <div className="px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/ongoing-projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-2xl font-medium transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.header
          className="mb-8 sm:mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4"
            variants={itemVariants}
          >
            <Building2 className="w-4 h-4" />
            {project.category.replace("_", " ")}
          </motion.div>

          <motion.h1
            className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-4"
            variants={itemVariants}
          >
            {project.title}
          </motion.h1>

          {project.description && (
            <motion.p
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl"
              variants={itemVariants}
            >
              {project.description}
            </motion.p>
          )}
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Main Content - Images and Gallery */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Featured Image */}
            {project.featuredImage && (
              <motion.div
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl cursor-zoom-in bg-gray-100 dark:bg-gray-900 aspect-[4/3]"
                onClick={() => openImage(project.featuredImage!, 0)}
              >
                <Image
                  src={project.featuredImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            )}

            {/* Gallery Grid */}
            {project.gallery && project.gallery.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Project Gallery
                </h3>
                <div
                  className={`grid gap-3 sm:gap-4 ${
                    isMobile ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"
                  }`}
                >
                  {project.gallery.map((image, index) => (
                    <motion.div
                      key={index}
                      variants={imageVariants}
                      whileHover="hover"
                      className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg cursor-zoom-in bg-gray-100 dark:bg-gray-900 aspect-square"
                      onClick={() => openImage(image.url, index + 1)}
                    >
                      <Image
                        src={image.url}
                        alt={image.caption || `Project image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Project Details */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border-2 border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                Project Details
              </h3>

              <div className="space-y-4 sm:space-y-5">
                {/* Status Badge */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      project.status === "in_progress"
                        ? "bg-blue-600 text-white"
                        : project.status === "planning"
                          ? "bg-amber-500 text-white"
                          : "bg-green-600 text-white"
                    }`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                  <span className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
                    {project.category.replace("_", " ")}
                  </span>
                </div>

                {/* Project Information */}
                <div className="space-y-4">
                  {project.clientName && (
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          Client
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {project.clientName}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          Location
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {project.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.startDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          Start Date
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {new Date(project.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.estimatedCompletionDate && (
                    <div className="flex items-start gap-3">
                      <Workflow className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          Est. Completion
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {new Date(
                            project.estimatedCompletionDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.size && (
                    <div className="flex items-start gap-3">
                      <Ruler className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          Size
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {project.size}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.value && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          Project Value
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {project.value}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                      Highlights
                    </h4>
                    <ul className="space-y-2">
                      {project.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6"
            onClick={closeImage}
          >
            {/* Navigation Arrows */}
            {allImages.length > 1 && !isMobile && (
              <>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    previousImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </>
            )}

            {/* Close Button */}
            <motion.button
              onClick={closeImage}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Image Counter */}
            {allImages.length > 1 && (
              <motion.div
                className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 sm:py-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-xs sm:text-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {currentImageIndex + 1} / {allImages.length}
              </motion.div>
            )}

            {/* Main Image */}
            <motion.div
              className="relative w-full h-full max-w-full max-h-full flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Full screen view"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                priority
              />
            </motion.div>

            {/* Mobile Swipe Instructions */}
            {isMobile && allImages.length > 1 && (
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Swipe to navigate
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OngoingProjectDetailsPage;
