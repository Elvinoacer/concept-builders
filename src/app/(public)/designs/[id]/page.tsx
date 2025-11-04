"use client";
import { Design } from "@/generated/prisma";
import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/design-detail/Breadcrumbs";
import DesignGallery from "@/components/design-detail/DesignGallery";
import DesignHeader from "@/components/design-detail/DesignHeader";
import DesignTabs from "@/components/design-detail/DesignTabs";
import CostToBuildTab from "@/components/design-detail/CostToBuildTab";
import FloorPlan from "@/components/design-detail/FloorPlan";
import PurchaseSidebar from "@/components/design-detail/PurchaseSidebar";
import RelatedDesigns from "@/components/design-detail/RelatedDesigns";
import Renderings from "@/components/design-detail/Renderings";
import { ThemeProvider } from "@/components/theme-provider";
import Loading from "./loading";
import ErrorState from "@/components/design-detail/ErrorState";
import NotFoundState from "@/components/design-detail/NotFoundState";

const DesignDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = use(params);
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const fetchDesign = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/designs/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setDesign(null);
        } else {
          throw new Error("Failed to fetch design");
        }
      } else {
        const data = await response.json();
        setDesign(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsVisible(true);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDesign();

      // Track design view
      const trackView = async () => {
        try {
          await fetch(`/api/designs/${id}/view`, {
            method: "POST",
          });
        } catch (error) {
          console.error("Error tracking design view:", error);
        }
      };
      trackView();
    }
  }, [id]);

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDesign} />;
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
      <AnimatePresence mode="wait">
        <motion.main
          key={design.id}
          variants={pageVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          exit="exit"
          className="flex-1 px-4 lg:px-8 xl:px-16 py-8 md:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 min-h-screen"
        >
          <div className="max-w-8xl mx-auto">
            {/* Breadcrumbs */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Breadcrumbs designName={design.name} />
            </motion.div>

            {/* Main Content Grid */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
              variants={containerVariants}
            >
              {/* Left Column - Content */}
              <motion.div
                className="lg:col-span-2 space-y-8 lg:space-y-12"
                variants={containerVariants}
              >
                {/* Header */}
                <motion.div variants={containerVariants}>
                  <DesignHeader
                    name={design.name}
                    description={design.description}
                  />
                </motion.div>

                {/* Gallery */}
                <motion.div
                  variants={containerVariants}
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <DesignGallery images={images} />
                </motion.div>

                {/* Renderings */}
                {renderings.length > 0 && (
                  <motion.div
                    variants={containerVariants}
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Renderings renderings={renderings} />
                  </motion.div>
                )}

                {/* Floor Plans */}
                {floorPlans.length > 0 && (
                  <motion.div
                    variants={containerVariants}
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-8"
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

                {/* Design Tabs */}
                <motion.div
                  variants={containerVariants}
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {design && <DesignTabs design={design} onFaqSubmitted={fetchDesign} />}
                </motion.div>
              </motion.div>

              {/* Right Column - Purchase Sidebar */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="sticky top-24">
                  <PurchaseSidebar design={design} />
                </div>
              </motion.div>
            </motion.div>

            {/* Cost to Build */}
            <motion.div
              variants={containerVariants}
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-20 lg:mt-24"
            >
              {design && <CostToBuildTab design={design} />}
            </motion.div>

            {/* Related Designs */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-20 lg:mt-24"
            >
              <RelatedDesigns
                categoryId={design.categoryId}
                currentDesignId={design.id}
              />
            </motion.div>
          </div>
        </motion.main>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default DesignDetailPage;