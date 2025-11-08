"use client";
import { useSearch } from "@/lib/SearchContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Eye,
  FileText,
  Grid3X3,
  List,
  Package,
  Receipt,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const PurchasedDesigns = ({
  searchQuery,
  viewMode = "grid",
}: {
  searchQuery: string;
  viewMode?: "grid" | "list";
}) => {
  const { data: session } = useSession();
  const { resultsRef } = useSearch();
  const [purchasedDesigns, setPurchasedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [localViewMode, setLocalViewMode] = useState<"grid" | "list">(viewMode);
  const [filteredDesigns, setFilteredDesigns] = useState([]);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      // Auto-set view mode based on screen size
      if (width < 768) {
        setLocalViewMode("list");
      } else {
        setLocalViewMode(viewMode);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [viewMode]);

  useEffect(() => {
    const fetchPurchasedDesigns = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/purchases");
        const data = await response.json();
        setPurchasedDesigns(data);
        setFilteredDesigns(data);
      } catch (error) {
        console.error("Error fetching purchased designs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchPurchasedDesigns();
    }
  }, [session]);

  // Filter designs based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredDesigns(purchasedDesigns);
    } else {
      const filtered = purchasedDesigns.filter(
        (design) =>
          design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          design.selectedPackage
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          design.selectedFileType
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredDesigns(filtered);
    }
  }, [searchQuery, purchasedDesigns]);

  const handleDownload = async (designId: string) => {
    try {
      // Implement download logic
      const response = await fetch(`/api/download/${designId}`);
      const data = await response.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error downloading design:", error);
    }
  };

  const handleViewInvoice = (designId: string) => {
    // Implement invoice viewing logic
    window.open(`/invoice/${designId}`, "_blank");
  };

  const handleViewDesign = (designId: string) => {
    // Implement design viewing logic
    window.open(`/designs/${designId}`, "_blank");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  if (loading) {
    return (
      <section ref={resultsRef as React.RefObject<HTMLDivElement>}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Purchased Designs
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 animate-pulse"
            >
              <div className="h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={resultsRef as React.RefObject<HTMLDivElement>}>
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Purchased Designs
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {filteredDesigns.length} design
            {filteredDesigns.length !== 1 ? "s" : ""} purchased
          </p>
        </div>

        {/* View Controls */}
        {!isMobile && (
          <div className="flex items-center gap-3">
            <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl p-1">
              <button
                onClick={() => setLocalViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  localViewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLocalViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  localViewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {filteredDesigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 sm:py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {searchQuery
                ? "No designs match your search"
                : "You haven't purchased any designs yet"}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start exploring our collection of architectural designs"}
            </p>
            <motion.a
              href="/designs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
            >
              Explore Designs
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        ) : localViewMode === "grid" ? (
          /* Grid View */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          >
            {filteredDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                variants={cardVariants}
                whileHover={!isMobile ? "hover" : undefined}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden group border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/30 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                  <Image
                    src={
                      design.purchasedFiles.find(file => file.type === 'IMAGE')?.url || "/images/category-placeholder.png"
                    }
                    alt={design.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-1 leading-tight">
                      {design.name}
                    </h4>
                    <p className="text-gray-200 text-sm">
                      Purchased:{" "}
                      {new Date(design.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleViewDesign(design.id)}
                      className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors duration-200"
                      title="View Design"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-6">
                  {/* Package Details */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Purchased Package
                      </span>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-xl">
                      <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {design.selectedPackage || "Digital Download"}
                      </p>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>Format: {design.selectedFileTypes.join(', ')}</p>
                        {design.selectedExtras && (
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span>
                              Extras:{" "}
                              {design.selectedExtras
                                .map((extra: any) => extra.name)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Purchased Files */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Purchased Files
                      </span>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-xl space-y-2">
                      {design.purchasedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between">
                          <p className="text-sm text-gray-900 dark:text-white">{file.name}</p>
                          <button onClick={() => window.open(file.url, '_blank')} className="text-sm text-blue-600 hover:underline">Download</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <motion.button
                      onClick={() => handleDownload(design.id)}
                      whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </motion.button>
                    <motion.button
                      onClick={() => handleViewInvoice(design.id)}
                      whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-xl transition-all duration-200 text-sm flex-1"
                    >
                      <Receipt className="w-4 h-4" />
                      Invoice
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* List View */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                variants={itemVariants}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/30 transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative w-full sm:w-48 h-40 sm:h-auto bg-gray-100 dark:bg-gray-900 flex-shrink-0">
                    <Image
                      src={
                        design.purchasedFiles.find(file => file.type === 'IMAGE')?.url ||
                        "/images/category-placeholder.png"
                      }
                      alt={design.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 192px"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                          {design.name}
                        </h4>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">
                              {design.selectedPackage || "Digital Download"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-green-500" />
                            <span>Format: {design.selectedFileTypes.join(', ')}</span>
                          </div>
                          {design.selectedExtras && (
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-500" />
                              <span>
                                Extras:{" "}
                                {design.selectedExtras
                                  .map((extra: any) => extra.name)
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            Purchased:{" "}
                            {new Date(design.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Purchased Files */}
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                              Purchased Files
                            </span>
                          </div>
                          <div className="bg-gray-50/50 dark:bg-gray-700/50 p-3 rounded-xl space-y-2">
                            {design.purchasedFiles.map((file) => (
                              <div key={file.id} className="flex items-center justify-between">
                                <p className="text-sm text-gray-900 dark:text-white">{file.name}</p>
                                <button onClick={() => window.open(file.url, '_blank')} className="text-sm text-blue-600 hover:underline">Download</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                        <motion.button
                          onClick={() => handleDownload(design.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 text-sm min-w-32"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </motion.button>
                        <motion.button
                          onClick={() => handleViewInvoice(design.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-lg transition-all duration-200 text-sm min-w-32"
                        >
                          <Receipt className="w-4 h-4" />
                          Invoice
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PurchasedDesigns;
