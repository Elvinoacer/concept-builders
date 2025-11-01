"use client";
import { motion } from "framer-motion";
import FeaturedDesigns from "@/components/design-showcase/FeaturedDesigns";
import ExploreDesigns from "@/components/design-showcase/ExploreDesigns";

const DesignShowcasePage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen"
    >
      <div className="space-y-16">
        <FeaturedDesigns />
        <ExploreDesigns />
      </div>
    </motion.main>
  );
};

export default DesignShowcasePage;
