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
      <div className="min-h-screen bg-ink px-4 min-[375px]:px-5 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto py-6 sm:py-8">
          {/* Skeleton Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-surface rounded-lg animate-pulse"></div>
            <div>
              <div className="h-8 bg-surface rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-surface rounded w-96 animate-pulse"></div>
            </div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-cb-border animate-pulse"
              >
                <div className="h-48 bg-surface rounded-t-2xl"></div>
                <div className="p-4">
                  <div className="h-6 bg-surface rounded mb-2"></div>
                  <div className="h-4 bg-surface rounded w-3/4"></div>
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
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-muted" />
          </div>
          <h2 className="text-2xl font-bold text-cream mb-3">
            No Purchased Designs
          </h2>
          <p className="text-cream-dim mb-8 leading-relaxed">
            You need to purchase a design before you can initialize a project.
            Explore our design collection to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/designs")}
              className="bg-gold text-ink px-6 py-3 rounded-xl font-semibold hover:bg-gold-light transition-all shadow-sm hover:shadow-md"
            >
              Browse Designs
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="px-6 py-3 text-cream-dim bg-surface border border-cb-border rounded-xl font-semibold hover:bg-card transition-colors"
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink px-4 min-[375px]:px-5 sm:px-6 md:px-8">
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
                className="p-2 rounded-lg hover:bg-surface transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-cream-dim" />
              </motion.button>
              <div>
                <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-cream leading-tight">
                  New Project
                </h1>
                <p className="text-cream-dim mt-2 text-base sm:text-lg">
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
              className="bg-card rounded-2xl p-4 border border-gold/40 shadow-sm flex-shrink-0"
            >
              <p className="text-sm font-medium text-cream mb-1">
                Selected Design
              </p>
              <p className="text-sm text-cream-dim truncate max-w-[200px]">
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
                  className={`relative bg-card rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedDesignId === design.id
                      ? "border-gold shadow-md"
                      : "border-cb-border hover:border-gold/30"
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
                        className="absolute top-3 right-3 bg-gold rounded-full p-2 shadow-lg"
                      >
                        <Check className="w-4 h-4 text-ink" />
                      </motion.div>
                    )}
                  </div>

                  {/* Design Info */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-cream mb-2 line-clamp-2 leading-tight">
                      {design.name}
                    </h3>

                    {design.description && (
                      <p className="text-sm text-cream-dim mb-3 line-clamp-2 leading-relaxed">
                        {design.description}
                      </p>
                    )}

                    {design.purchasedAt && (
                      <p className="text-xs text-muted">
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
          className="sticky bottom-6 bg-card rounded-2xl p-4 border border-cb-border shadow-lg sm:static sm:bg-transparent sm:border-none sm:shadow-none sm:p-0"
        >
          <motion.button
            whileHover={{ scale: !selectedDesignId || initializing ? 1 : 1.02 }}
            whileTap={{ scale: !selectedDesignId || initializing ? 1 : 0.98 }}
            onClick={handleInitializeProject}
            disabled={!selectedDesignId || initializing}
            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
              !selectedDesignId || initializing
                ? "bg-surface text-muted cursor-not-allowed"
                : "bg-gold text-ink hover:bg-gold-light shadow-sm hover:shadow-md"
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
            <p className="text-sm text-cream-dim text-center mt-3">
              Please select a design to continue
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InitializeProjectPage;
