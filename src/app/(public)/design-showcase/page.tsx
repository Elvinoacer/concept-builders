// "use client";
// import { motion } from "framer-motion";
// import FeaturedDesigns from "@/components/design-showcase/FeaturedDesigns";
// import ExploreDesigns from "@/components/design-showcase/ExploreDesigns";

// const DesignShowcasePage = () => {
//   return (
//     <motion.main
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//       className="w-full max-w-full mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen"
//     >
//       <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
//         <FeaturedDesigns />
//         <ExploreDesigns />
//       </div>
//     </motion.main>
//   );
// };

// export default DesignShowcasePage;

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
      className="w-full max-w-full mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen"
    >
      <div className="space-y-12 sm:space-y-16 md:space-y-20">
        <FeaturedDesigns />
        <ExploreDesigns />
      </div>
    </motion.main>
  );
};

export default DesignShowcasePage;
