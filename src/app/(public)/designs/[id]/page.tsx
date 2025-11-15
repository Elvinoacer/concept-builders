import { Design } from "@/generated/prisma";
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
import { DesignViewTracker } from "@/components/design-detail/DesignViewTracker";
import { Metadata, ResolvingMetadata } from "next";
import prisma from "@/lib/prisma";

type Props = {
  params: { id: string };
};

async function getDesign(id: string) {
  const design = await prisma.design.findUnique({
    where: { id },
    include: {
      images: true,
      floorPlans: true,
      reviews: {
        include: {
          author: true,
        },
      },
      category: true,
    },
  });
  return design;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const design = await getDesign(id);

  if (!design) {
    return {
      title: "Design Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const newImages = design.images.map((image) => ({
    url: image.url,
    width: 1200,
    height: 630,
    alt: design.name,
  }));

  return {
    title: design.name,
    description: design.description,
    openGraph: {
      title: design.name,
      description: design.description || "Check out this amazing design!",
      images: [...newImages, ...previousImages],
    },
  };
}

const DesignDetailPage = async ({ params }: { params: { id: string } }) => {
  const design = await getDesign(params.id);

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
          className="flex-1 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 min-h-screen"
        >
          <div className="w-full max-w-full mx-auto">
            <motion.div
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Breadcrumbs designName={design.name} />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12"
            >
              <motion.div
                className="lg:col-span-2 space-y-6 sm:space-y-8 lg:space-y-12"
              >
                <motion.div>
                  <DesignHeader
                    name={design.name}
                    description={design.description}
                  />
                </motion.div>

                <motion.div
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <DesignGallery images={images} />
                </motion.div>

                {renderings.length > 0 && (
                  <motion.div
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
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

                <motion.div
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {design && (
                    <DesignTabs design={design} onFaqSubmitted={() => {}} />
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="sticky top-20 sm:top-24">
                  <PurchaseSidebar design={design} />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16 sm:mt-20 lg:mt-24"
            >
              {design && <CostToBuildTab design={design} />}
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
        </motion.main>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default DesignDetailPage;
