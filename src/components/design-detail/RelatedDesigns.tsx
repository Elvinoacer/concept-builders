"use client";

import { useEffect, useState } from "react";
import { Design } from "@/generated/prisma";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Heart, Eye, Building2 } from "lucide-react";

const RelatedDesigns = ({
  categoryId,
  currentDesignId,
}: {
  categoryId: string | null;
  currentDesignId: string;
}) => {
  const [relatedDesigns, setRelatedDesigns] = useState<Design[]>([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<number[]>([]);
  const [hoveredDesign, setHoveredDesign] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedDesigns = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `/api/designs?categoryId=${categoryId}&limit=6&exclude=${currentDesignId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch related designs");
        }
        const data = await response.json();
        setRelatedDesigns(data.designs);
        setCurrentImageIndexes(new Array(data.designs.length).fill(0));
      } catch (error) {
        console.error("Error fetching related designs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedDesigns();
  }, [categoryId, currentDesignId]);

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
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <motion.section
        className="mt-20 md:mt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Related Designs
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Loading similar architectural designs...
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border-2 border-gray-200/50 dark:border-gray-700/50 animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-2xl mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  }

  if (relatedDesigns.length === 0) {
    return (
      <motion.section
        className="mt-20 md:mt-24 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Building2 className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
            No Related Designs Found
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-lg max-w-md mx-auto">
            Explore our complete collection to discover more architectural
            designs that match your style.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6"
          >
            <Link
              href="/designs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Browse All Designs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="mt-20 md:mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-12 md:mb-16"
        variants={containerVariants}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4"
          variants={itemVariants}
        >
          Related Designs
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Discover more architectural designs that complement your style and
          requirements
        </motion.p>
      </motion.div>

      {/* Designs Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        <AnimatePresence>
          {relatedDesigns.map((design, index) => {
            const imageUrls =
              design.images?.map((img) => img.url) ||
              design.files
                ?.filter((file: any) => file.type === "IMAGE")
                .map((file: any) => file.url) ||
              [];

            return (
              <motion.div
                key={design.id}
                variants={itemVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredDesign(design.id)}
                onHoverEnd={() => setHoveredDesign(null)}
                className="group cursor-pointer"
              >
                <Link href={`/designs/${design.id}`}>
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:border-primary/30 transition-all duration-500 h-full flex flex-col">
                    {/* Image Container */}
                    <motion.div
                      className="relative overflow-hidden bg-gray-100 dark:bg-gray-900"
                      variants={imageVariants}
                    >
                      {imageUrls.length > 0 ? (
                        <Image
                          src={imageUrls[0]}
                          alt={design.name}
                          width={400}
                          height={300}
                          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                        />
                      ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                        </div>
                      )}

                      {/* Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {/* View Details Button */}
                        <motion.div
                          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl text-slate-800 dark:text-white font-semibold text-sm">
                            <Eye className="w-4 h-4" />
                            View Details
                          </div>
                        </motion.div>

                        {/* Favorite Button */}
                        <motion.button
                          className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle favorite logic
                          }}
                        >
                          <Heart className="w-5 h-5" />
                        </motion.button>
                      </motion.div>

                      {/* Price Badge */}
                      <motion.div
                        className="absolute top-4 left-4 px-4 py-2 rounded-2xl bg-gradient-to-r from-primary to-blue-500 text-white font-bold text-lg shadow-lg"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        ${design.basePrice?.toLocaleString()}
                      </motion.div>

                      {/* Rating Badge */}
                      {design.rating && (
                        <motion.div
                          className="absolute top-4 right-4 px-3 py-1 rounded-2xl bg-amber-500/90 backdrop-blur-sm text-white text-sm font-semibold flex items-center gap-1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          <Star className="w-3 h-3 fill-current" />
                          {design.rating}
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <motion.h3
                        className="font-bold text-xl text-slate-800 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {design.name}
                      </motion.h3>

                      <motion.p
                        className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed flex-1 line-clamp-3 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        {design.description}
                      </motion.p>

                      {/* Features */}
                      <motion.div
                        className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          {design.bedrooms && (
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">
                                bed
                              </span>
                              {design.bedrooms}
                            </div>
                          )}
                          {design.bathrooms && (
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">
                                bathtub
                              </span>
                              {design.bathrooms}
                            </div>
                          )}
                          {design.squareFootage && (
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">
                                square_foot
                              </span>
                              {design.squareFootage} sq ft
                            </div>
                          )}
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* View All CTA */}
      <motion.div className="text-center mt-12" variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/designs"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore Complete Collection
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default RelatedDesigns;
