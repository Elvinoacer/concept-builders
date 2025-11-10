"use client";
import { useSearch } from "@/lib/SearchContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileDown,
  FileText,
  FolderOpen,
  Grid3X3,
  List,
  Loader2,
  Package,
  Receipt,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import JSZip from "jszip";
import { saveAs } from "file-saver";

interface DesignFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: string;
  format: string;
}

interface PurchasedDesign {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  selectedPackage: string;
  selectedFileTypes: string[];
  selectedExtras: any[];
  createdAt: string;
  purchasedFiles: DesignFile[];
  orderId: string;
  status: string;
}

interface DownloadState {
  [designId: string]: {
    isDownloading: boolean;
    downloadedFiles: Set<string>;
    progress?: number;
  };
}

const PurchasedDesigns = ({
  searchQuery,
  viewMode = "grid",
}: {
  searchQuery: string;
  viewMode?: "grid" | "list";
}) => {
  const { data: session } = useSession();
  const { resultsRef } = useSearch();
  const [purchasedDesigns, setPurchasedDesigns] = useState<PurchasedDesign[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [localViewMode, setLocalViewMode] = useState<"grid" | "list">(viewMode);
  const [filteredDesigns, setFilteredDesigns] = useState<PurchasedDesign[]>([]);
  const [downloadStates, setDownloadStates] = useState<DownloadState>({});

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
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

  // Fetch purchased designs
  useEffect(() => {
    const fetchPurchasedDesigns = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/purchases");
        if (!response.ok) throw new Error("Failed to fetch purchases");
        const data = await response.json();
        setPurchasedDesigns(data);
        setFilteredDesigns(data);

        // Initialize download states
        const initialDownloadStates: DownloadState = {};
        data.forEach((design: PurchasedDesign) => {
          initialDownloadStates[design.id] = {
            isDownloading: false,
            downloadedFiles: new Set(),
            progress: 0,
          };
        });
        setDownloadStates(initialDownloadStates);
      } catch (error) {
        console.error("Error fetching purchased designs:", error);
        toast.error("Failed to load your purchased designs");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchPurchasedDesigns();
    }
  }, [session]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredDesigns(purchasedDesigns);
    } else {
      const filtered = purchasedDesigns.filter(
        (design) =>
          (design.name &&
            design.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (design.selectedPackage &&
            design.selectedPackage
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (design.selectedFileTypes &&
            design.selectedFileTypes.some(
              (type) =>
                type && type.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
      setFilteredDesigns(filtered);
    }
  }, [searchQuery, purchasedDesigns]);

  // Enhanced download function with progress tracking
  const handleDownloadFile = async (designId: string, file: DesignFile) => {
    try {
      // Update download state
      setDownloadStates((prev) => ({
        ...prev,
        [designId]: {
          ...prev[designId],
          isDownloading: true,
        },
      }));

      toast.info(`Downloading ${file.name}...`);

      // Create a direct download link
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      link.target = "_blank";

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setDownloadStates((prev) => ({
          ...prev,
          [designId]: {
            ...prev[designId],
            progress: Math.min((prev[designId]?.progress || 0) + 10, 90),
          },
        }));
      }, 200);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Wait a bit for download to start
      await new Promise((resolve) => setTimeout(resolve, 1000));

      clearInterval(progressInterval);

      // Mark as downloaded
      setDownloadStates((prev) => ({
        ...prev,
        [designId]: {
          ...prev[designId],
          isDownloading: false,
          downloadedFiles: new Set(prev[designId]?.downloadedFiles).add(
            file.id
          ),
          progress: 100,
        },
      }));

      toast.success(`Downloaded ${file.name} successfully!`);

      // Reset progress after a delay
      setTimeout(() => {
        setDownloadStates((prev) => ({
          ...prev,
          [designId]: {
            ...prev[designId],
            progress: 0,
          },
        }));
      }, 2000);
    } catch (error) {
      console.error("Error downloading file:", error);
      setDownloadStates((prev) => ({
        ...prev,
        [designId]: {
          ...prev[designId],
          isDownloading: false,
          progress: 0,
        },
      }));
      toast.error(`Failed to download ${file.name}`);
    }
  };

  const handleDownloadAll = async (design: PurchasedDesign) => {
    try {
      setDownloadStates((prev) => ({
        ...prev,
        [design.id]: {
          ...prev[design.id],
          isDownloading: true,
          progress: 0,
        },
      }));

      toast.info(
        `Zipping ${design.purchasedFiles.length} files... This may take a moment.`
      );

      const zip = new JSZip();

      // Fetch and add each file to the zip
      for (let i = 0; i < design.purchasedFiles.length; i++) {
        const file = design.purchasedFiles[i];
        const progress = ((i + 1) / design.purchasedFiles.length) * 100;

        try {
          const response = await fetch(file.url);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${file.name}`);
          }
          const blob = await response.blob();
          zip.file(file.name, blob);

          setDownloadStates((prev) => ({
            ...prev,
            [design.id]: {
              ...prev[design.id],
              progress,
            },
          }));
        } catch (error) {
          console.error(`Error fetching file ${file.name}:`, error);
          toast.error(`Skipping ${file.name} due to an error.`);
        }
      }

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${design.name.replace(/\s+/g, "_")}_files.zip`);

      setDownloadStates((prev) => ({
        ...prev,
        [design.id]: {
          ...prev[design.id],
          isDownloading: false,
          progress: 100,
        },
      }));

      toast.success(`All files downloaded successfully as a zip!`);
    } catch (error) {
      console.error("Error creating zip file:", error);
      setDownloadStates((prev) => ({
        ...prev,
        [design.id]: {
          ...prev[design.id],
          isDownloading: false,
          progress: 0,
        },
      }));
      toast.error("Failed to create zip file.");
    }
  };

  // Preview file in new tab
  const handlePreviewFile = (file: DesignFile) => {
    window.open(file.url, "_blank");
    toast.info(`Opening ${file.name} in new tab`);
  };

  const handleViewInvoice = (designId: string) => {
    window.location.href = `/invoice/${designId}`;
    toast.info("Opening invoice...");
  };

  const handleViewDesign = (designId: string) => {
    window.open(`/designs/${designId}`, "_blank");
    toast.info("Viewing design details...");
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

  // File type icons
  const getFileIcon = (format: string) => {
    const formatLower = format.toLowerCase();
    if (formatLower.includes("pdf"))
      return <FileText className="w-4 h-4 text-red-500" />;
    if (formatLower.includes("cad") || formatLower.includes("dwg"))
      return <Grid3X3 className="w-4 h-4 text-blue-500" />;
    if (formatLower.includes("excel") || formatLower.includes("xlsx"))
      return <FileDown className="w-4 h-4 text-green-500" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  // Loading skeleton
  if (loading) {
    return (
      <section ref={resultsRef as React.RefObject<HTMLDivElement>}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Purchased Designs
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
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
            {filteredDesigns.length > 0 &&
              ` • ${filteredDesigns.reduce((total, design) => total + design.purchasedFiles.length, 0)} files available`}
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
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLocalViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  localViewMode === "list"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {filteredDesigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
            key="grid-view"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredDesigns.map((design) => (
              <motion.div
                key={design.id}
                variants={cardVariants}
                whileHover={!isMobile ? "hover" : undefined}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden group border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/30 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
                  <Image
                    src={
                      design.images[0]?.url ||
                      "/images/category-placeholder.png"
                    }
                    alt={design.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Download Progress Overlay */}
                  {downloadStates[design.id]?.progress &&
                    downloadStates[design.id].progress > 0 && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${downloadStates[design.id].progress}%`,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}

                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-1 leading-tight line-clamp-2">
                      {design.name}
                    </h4>
                    <p className="text-gray-200 text-sm">
                      Purchased:{" "}
                      {new Date(design.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleViewDesign(design.id)}
                      className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors duration-200"
                      title="View Design"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDownloadAll(design)}
                      disabled={downloadStates[design.id]?.isDownloading}
                      className="p-2 bg-blue-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                      title="Download All Files"
                    >
                      {downloadStates[design.id]?.isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
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
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 sm:p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                      <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {design.selectedPackage || "Digital Download"}
                      </p>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>Format: {design.selectedFileTypes.join(", ")}</p>
                        {design.selectedExtras &&
                          design.selectedExtras.length > 0 && (
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Available Files ({design.purchasedFiles.length})
                        </span>
                      </div>
                      {design.purchasedFiles.length > 1 && (
                        <motion.button
                          onClick={() => handleDownloadAll(design)}
                          disabled={downloadStates[design.id]?.isDownloading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {downloadStates[design.id]?.isDownloading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          Download All
                        </motion.button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {design.purchasedFiles.map((file) => (
                        <motion.div
                          key={file.id}
                          whileHover={{ scale: 1.01 }}
                          className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {getFileIcon(file.format)}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {file.type} • {file.size || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {downloadStates[design.id]?.downloadedFiles.has(
                              file.id
                            ) && (
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            )}
                            <motion.button
                              onClick={() => handlePreviewFile(file)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              title="Preview"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() =>
                                handleDownloadFile(design.id, file)
                              }
                              disabled={
                                downloadStates[design.id]?.isDownloading
                              }
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <motion.button
                      onClick={() => handleDownloadAll(design)}
                      disabled={downloadStates[design.id]?.isDownloading}
                      whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex-1 disabled:opacity-50"
                    >
                      {downloadStates[design.id]?.isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {downloadStates[design.id]?.isDownloading
                        ? "Downloading..."
                        : "Download All"}
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
            key="list-view"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredDesigns.map((design) => (
              <motion.div
                key={design.id}
                variants={itemVariants}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/30 transition-all duration-300 overflow-hidden"
              >
                {/* Download Progress Bar */}
                {downloadStates[design.id]?.progress &&
                  downloadStates[design.id].progress > 0 && (
                    <div className="h-1 bg-gray-200 dark:bg-gray-700">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${downloadStates[design.id].progress}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}

                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative w-full sm:w-48 h-40 sm:h-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex-shrink-0">
                    <Image
                      src={
                        design.images[0]?.url ||
                        "/images/category-placeholder.png"
                      }
                      alt={design.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 192px"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-r sm:from-black/50 sm:to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
                            {design.name}
                          </h4>
                          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            <motion.button
                              onClick={() => handleViewDesign(design.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              title="View Design"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDownloadAll(design)}
                              disabled={
                                downloadStates[design.id]?.isDownloading
                              }
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50"
                              title="Download All"
                            >
                              {downloadStates[design.id]?.isDownloading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </motion.button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">
                              {design.selectedPackage || "Digital Download"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-green-500" />
                            <span>
                              Format: {design.selectedFileTypes.join(", ")}
                            </span>
                          </div>
                          {design.selectedExtras &&
                            design.selectedExtras.length > 0 && (
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
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FolderOpen className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                Files ({design.purchasedFiles.length})
                              </span>
                            </div>
                            {design.purchasedFiles.length > 1 && (
                              <motion.button
                                onClick={() => handleDownloadAll(design)}
                                disabled={
                                  downloadStates[design.id]?.isDownloading
                                }
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                              >
                                {downloadStates[design.id]?.isDownloading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Download className="w-3 h-3" />
                                )}
                                All
                              </motion.button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {design.purchasedFiles.map((file) => (
                              <motion.div
                                key={file.id}
                                whileHover={{ scale: 1.01 }}
                                className="flex items-center justify-between p-2 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  {getFileIcon(file.format)}
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                      {file.type}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  {downloadStates[
                                    design.id
                                  ]?.downloadedFiles.has(file.id) && (
                                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                                  )}
                                  <motion.button
                                    onClick={() => handlePreviewFile(file)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    title="Preview"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() =>
                                      handleDownloadFile(design.id, file)
                                    }
                                    disabled={
                                      downloadStates[design.id]?.isDownloading
                                    }
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50"
                                    title="Download"
                                  >
                                    <Download className="w-3 h-3" />
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-40">
                        <motion.button
                          onClick={() => handleDownloadAll(design)}
                          disabled={downloadStates[design.id]?.isDownloading}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 text-sm min-w-32 disabled:opacity-50"
                        >
                          {downloadStates[design.id]?.isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          {downloadStates[design.id]?.isDownloading
                            ? "Downloading..."
                            : "Download All"}
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
