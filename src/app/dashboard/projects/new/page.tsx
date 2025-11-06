"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import { Check, ArrowLeft, ShoppingBag, Loader } from "lucide-react";

interface PurchasedDesign {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  purchasedAt?: string;
}

const InitializeProjectPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [purchasedDesigns, setPurchasedDesigns] = useState<PurchasedDesign[]>(
    []
  );
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    const fetchPurchasedDesigns = async () => {
      if (!session) return;
      try {
        const response = await fetch("/api/purchases");
        if (!response.ok) {
          throw new Error("Failed to fetch purchased designs");
        }
        const data: PurchasedDesign[] = await response.json();
        setPurchasedDesigns(data);
      } catch (error) {
        console.error("Error fetching purchased designs:", error);
        toast.error("Failed to load your purchased designs.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedDesigns();
  }, [session]);

  const handleInitializeProject = async () => {
    if (!selectedDesignId) {
      toast.error("Please select a design to initialize your project.");
      return;
    }

    setInitializing(true);
    try {
      const response = await fetch("/api/projects/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ designId: selectedDesignId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initialize project");
      }

      toast.success("Project initialized successfully!");
      router.push("/dashboard/projects");
    } catch (error: any) {
      console.error("Error initializing project:", error);
      toast.error(error.message || "Failed to initialize project.");
    } finally {
      setInitializing(false);
    }
  };

  const selectedDesign = purchasedDesigns.find(
    (design) => design.id === selectedDesignId
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 min-[375px]:px-5 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto py-6 sm:py-8">
          {/* Skeleton Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
            </div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (purchasedDesigns.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No Purchased Designs
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            You need to purchase a design before you can initialize a project.
            Explore our design collection to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/designs")}
              className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-500 transition-all shadow-sm hover:shadow-md"
            >
              Browse Designs
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 min-[375px]:px-5 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <div>
                <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  New Project
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg">
                  Select one of your purchased designs to start a new project
                </p>
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedDesign && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-blue-200 dark:border-blue-800 shadow-sm flex-shrink-0"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Selected Design
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                {selectedDesign.name}
              </p>
            </motion.div>
          )}
        </motion.header>

        {/* Designs Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          <AnimatePresence>
            {purchasedDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                layout
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedDesignId === design.id
                      ? "border-blue-500 shadow-md"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedDesignId(design.id)}
                >
                  {/* Design Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      src={design.imageUrl || "/images/design-placeholder.jpg"}
                      alt={design.name}
                      fill
                      className="w-full h-full object-cover"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Selection Checkmark */}
                    {selectedDesignId === design.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 bg-blue-500 rounded-full p-2 shadow-lg"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Design Info */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                      {design.name}
                    </h3>

                    {design.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                        {design.description}
                      </p>
                    )}

                    {design.purchasedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Purchased{" "}
                        {new Date(design.purchasedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky bottom-6 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg sm:static sm:bg-transparent sm:border-none sm:shadow-none sm:p-0"
        >
          <motion.button
            whileHover={{ scale: !selectedDesignId || initializing ? 1 : 1.02 }}
            whileTap={{ scale: !selectedDesignId || initializing ? 1 : 0.98 }}
            onClick={handleInitializeProject}
            disabled={!selectedDesignId || initializing}
            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
              !selectedDesignId || initializing
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-700 hover:to-cyan-500 shadow-sm hover:shadow-md"
            }`}
          >
            {initializing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Initializing Project...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Initialize Project
              </>
            )}
          </motion.button>

          {!selectedDesignId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3">
              Please select a design to continue
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InitializeProjectPage;
