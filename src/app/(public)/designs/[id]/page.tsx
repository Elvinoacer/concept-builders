"use client";
import { Design } from "@/generated/prisma";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/design-detail/Breadcrumbs";
import DesignGallery from "@/components/design-detail/DesignGallery";
import DesignHeader from "@/components/design-detail/DesignHeader";
import DesignTabs from "@/components/design-detail/DesignTabs";
import FloorPlan from "@/components/design-detail/FloorPlan";
import PurchaseSidebar from "@/components/design-detail/PurchaseSidebar";
import RelatedDesigns from "@/components/design-detail/RelatedDesigns";
import Renderings from "@/components/design-detail/Renderings";
import { ThemeProvider } from "@/components/theme-provider";
import Loading from "./loading";
import ErrorState from "@/components/design-detail/ErrorState";
import NotFoundState from "@/components/design-detail/NotFoundState";
import { DesignViewTracker } from "@/components/design-detail/DesignViewTracker";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const DesignDetailPage = () => {
  const router = useRouter();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchDesign = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await fetch(`/api/designs/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch design");
          }
          const data = await response.json();
          setDesign(data);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDesign();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState onRetry={() => router.refresh()} message={error} />;
  }

  if (!design) {
    return <NotFoundState />;
  }

  const images = design.images || [];
  const renderings = design.images || [];
  const floorPlans = design.floorPlans || [];

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DesignViewTracker designId={design.id} />
      <AnimatePresence mode="wait">
        <motion.main
          key={design.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
          className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 min-h-screen pb-24 lg:pb-12"
        >
          {/* Hero Section Background */}
          <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10">
            <motion.div
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Breadcrumbs designName={design.name} />
            </motion.div>

            <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Main Content Column */}
              <motion.div className="lg:col-span-8 space-y-8 lg:space-y-12">
                <motion.div>
                  <DesignHeader
                    name={design.name}
                    description={design.description}
                  />
                </motion.div>

                <motion.div 
                  whileInView="visible" 
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-black/5 dark:ring-white/10"
                >
                  <DesignGallery images={images} />
                </motion.div>

                {renderings.length > 0 && (
                  <motion.div whileInView="visible" viewport={{ once: true }}>
                    <Renderings renderings={renderings} />
                  </motion.div>
                )}

                {floorPlans.length > 0 && (
                  <motion.div
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-6 sm:space-y-8"
                  >
                    {floorPlans.map((fp, index) => (
                      <motion.div
                        key={fp.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true }}
                      >
                        <FloorPlan
                          key={fp.id}
                          design={design}
                          floorPlanUrl={fp.url}
                          index={index}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <motion.div whileInView="visible" viewport={{ once: true }}>
                  {design && (
                    <DesignTabs design={design} onFaqSubmitted={() => {}} />
                  )}
                </motion.div>
              </motion.div>

              {/* Sidebar Column - Visible on all devices */}
              <motion.div
                className="lg:col-span-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="lg:sticky lg:top-24">
                  <PurchaseSidebar design={design} />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-16 sm:mt-20 lg:mt-24"
            >
              <RelatedDesigns
                categoryId={design.categoryId}
                currentDesignId={design.id}
              />
            </motion.div>
          </div>

          {/* Mobile Sticky Purchase Bar */}
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Starting from</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(design.basePrice)}
                </span>
              </div>
              <button 
                onClick={() => {
                  // Scroll to purchase section which has the sidebar with all the logic
                  const purchaseSection = document.getElementById('purchase-options');
                  if (purchaseSection) {
                    purchaseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    // Fallback: scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-400/20 transition-all active:scale-95"
              >
                Purchase Now
              </button>
            </div>
          </motion.div>
        </motion.main>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default DesignDetailPage;
