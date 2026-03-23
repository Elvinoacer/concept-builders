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
  Image as ImageIcon,
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
  const [filteredDesigns, setFilteredDesigns] = useState<PurchasedDesign[]>([]);
  const [downloadStates, setDownloadStates] = useState<DownloadState>({});

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
        `Preparing your package... This may take a moment.`
      );

      const zip = new JSZip();
      const folderName = design.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const rootFolder = zip.folder(folderName);

      if (!rootFolder) throw new Error("Failed to create zip folder");

      // Add purchased files
      for (let i = 0; i < design.purchasedFiles.length; i++) {
        const file = design.purchasedFiles[i];
        const progress = ((i + 1) / (design.purchasedFiles.length + design.images.length)) * 100;

        try {
          const response = await fetch(file.url);
          if (!response.ok) throw new Error(`Failed to fetch ${file.name}`);
          const blob = await response.blob();
          rootFolder.file(file.name, blob);

          setDownloadStates((prev) => ({
            ...prev,
            [design.id]: {
              ...prev[design.id],
              progress,
            },
          }));
        } catch (error) {
          console.error(`Error fetching file ${file.name}:`, error);
        }
      }

      // Add design images
      const imagesFolder = rootFolder.folder("images");
      if (imagesFolder) {
        for (let i = 0; i < design.images.length; i++) {
          const image = design.images[i];
          try {
             const response = await fetch(image.url);
             if (response.ok) {
               const blob = await response.blob();
               const ext = image.url.split('.').pop() || 'jpg';
               imagesFolder.file(`image_${i + 1}.${ext}`, blob);
             }
          } catch (error) {
            console.error("Error fetching image:", error);
          }
        }
      }

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${folderName}_complete_package.zip`);

      setDownloadStates((prev) => ({
        ...prev,
        [design.id]: {
          ...prev[design.id],
          isDownloading: false,
          progress: 100,
        },
      }));

      toast.success(`Package downloaded successfully!`);
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
      toast.error("Failed to create download package.");
    }
  };

  const handleViewInvoice = (designId: string) => {
    window.location.href = `/dashboard/invoice/${designId}`;
  };

  const handleViewDesign = (designId: string) => {
    window.open(`/designs/${designId}`, "_blank");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const getFileIcon = (format: string | undefined) => {
    if (!format) return <FileText className="w-4 h-4 text-cream-dim" />;
    const formatLower = format.toLowerCase();
    if (formatLower.includes("pdf")) return <FileText className="w-4 h-4 text-red-500" />;
    if (formatLower.includes("cad") || formatLower.includes("dwg")) return <Grid3X3 className="w-4 h-4 text-gold" />;
    if (formatLower.includes("excel") || formatLower.includes("xlsx")) return <FileDown className="w-4 h-4 text-emerald-400" />;
    if (formatLower.includes("jpg") || formatLower.includes("png")) return <ImageIcon className="w-4 h-4 text-purple-500" />;
    return <FileText className="w-4 h-4 text-cream-dim" />;
  };

  if (loading) {
    return (
      <section ref={resultsRef as React.RefObject<HTMLDivElement>}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-cream">
            My Purchased Designs
          </h3>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-card/80 backdrop-blur-sm rounded-2xl border border-cb-border p-6 animate-pulse h-48"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={resultsRef as React.RefObject<HTMLDivElement>}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-cream mb-1">
            My Purchased Designs
          </h3>
          <p className="text-cream-dim text-sm">
            Manage and download your purchased design packages.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredDesigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12 bg-card/50 backdrop-blur-sm rounded-3xl border border-dashed border-cb-border"
          >
            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gold" />
            </div>
            <h4 className="text-lg font-semibold text-cream mb-2">
              No Purchases Yet
            </h4>
            <p className="text-cream-dim text-sm mb-6 max-w-sm mx-auto">
              Start your journey by exploring our collection of premium architectural designs.
            </p>
            <motion.a
              href="/designs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-ink font-medium rounded-xl hover:bg-gold-light transition-colors shadow-lg"
            >
              Browse Designs
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {filteredDesigns.map((design) => (
              <motion.div
                key={design.id}
                variants={itemVariants}
                className="group bg-card rounded-3xl border border-cb-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="relative w-full lg:w-72 h-48 lg:h-auto flex-shrink-0 bg-surface">
                    <Image
                      src={design.images[0]?.url || "/images/category-placeholder.png"}
                      alt={design.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                    <div className="absolute bottom-4 left-4 lg:hidden">
                      <h4 className="text-white font-bold text-lg line-clamp-1">{design.name}</h4>
                      <p className="text-cream-dim text-sm">{new Date(design.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                      <div className="space-y-4 flex-1">
                        <div className="hidden lg:block">
                          <div className="flex items-center justify-between">
                             <h4 className="text-2xl font-bold text-cream mb-1">
                            {design.name}
                          </h4>
                          <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-medium rounded-full">
                            Purchased
                          </span>
                          </div>
                         
                          <p className="text-cream-dim text-sm">
                            Order ID: <span className="font-mono text-cream">#{design.orderId.substring(0, 8)}</span> • {new Date(design.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Included Items Grid */}
                        <div className="bg-surface rounded-2xl p-4 border border-cb-border">
                          <h5 className="text-xs font-semibold text-cream-dim uppercase tracking-wider mb-3">
                            Package Contents
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {design.purchasedFiles.map((file) => (
                              <div key={file.id} className="flex items-center gap-2 text-sm text-cream-dim">
                                {getFileIcon(file.type)}
                                <span className="truncate">{file.name}</span>
                              </div>
                            ))}
                            {design.images.length > 0 && (
                               <div className="flex items-center gap-2 text-sm text-cream-dim">
                                <ImageIcon className="w-4 h-4 text-purple-500" />
                                <span>{design.images.length} High-Res Images</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[160px]">
                        <motion.button
                          onClick={() => handleDownloadAll(design)}
                          disabled={downloadStates[design.id]?.isDownloading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-ink font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloadStates[design.id]?.isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          <span>
                            {downloadStates[design.id]?.isDownloading
                              ? "Zipping..."
                              : "Download Package"}
                          </span>
                        </motion.button>

                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => handleViewDesign(design.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-cb-border text-cream-dim font-medium rounded-xl hover:bg-card transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </motion.button>
                          <motion.button
                            onClick={() => handleViewInvoice(design.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-cb-border text-cream-dim font-medium rounded-xl hover:bg-card transition-colors text-sm"
                          >
                            <Receipt className="w-4 h-4" />
                            Invoice
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {downloadStates[design.id]?.isDownloading && (
                      <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gold"
                          initial={{ width: 0 }}
                          animate={{ width: `${downloadStates[design.id].progress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    )}
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
