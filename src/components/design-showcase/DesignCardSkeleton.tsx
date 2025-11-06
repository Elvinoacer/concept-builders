import { motion } from "framer-motion";

const DesignCardSkeleton = ({ index }: { index: number }) => {
  return (
    <motion.div
      className="group overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-md"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative">
        <div className="w-full h-32 sm:h-36 md:h-40 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
      <div className="p-3 xs:p-4">
        <div className="h-5 xs:h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-3 xs:h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-3 xs:h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
        <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-3 xs:mt-4"></div>
      </div>
    </motion.div>
  );
};

export default DesignCardSkeleton;
