// "use client";

// import { motion } from "framer-motion";

// const DesignHeader = ({
//   name,
//   description,
// }: {
//   name: string;
//   description: string;
// }) => {
//   return (
//     <motion.div
//       className="mb-10 md:mb-14 border-b border-gray-200/60 dark:border-gray-700/60 pb-8"
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
//     >
//       {/* Title with elegant typography */}
//       <motion.h1
//         className="text-4xl md:text-5xl lg:text-5xl font-light tracking-tight mb-6 leading-tight"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, delay: 0.2 }}
//       >
//         <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//           {name}
//         </span>
//       </motion.h1>

//       {/* Description with sophisticated styling */}
//       <motion.div
//         className="max-w-4xl"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.8, delay: 0.4 }}
//       >
//         <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light tracking-wide">
//           {description}
//         </p>
//       </motion.div>

//       {/* Elegant separator */}
//       <motion.div
//         className="flex items-center gap-4 mt-8"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.8, delay: 0.6 }}
//       >
//         <div className="w-12 h-px bg-gradient-to-r from-primary to-transparent"></div>
//         <div className="w-2 h-2 rounded-full bg-primary"></div>
//         <div className="w-12 h-px bg-gradient-to-l from-primary to-transparent"></div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default DesignHeader;

"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const DesignHeader = ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const descriptionVariants = {
    collapsed: {
      height: "4.5rem",
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
    expanded: {
      height: "auto",
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const shouldTruncate = description.length > 200;

  return (
    <motion.div
      className="mb-6 sm:mb-8 md:mb-12 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/5 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />

      <motion.div
        className="absolute -bottom-3 -right-4 sm:-bottom-4 sm:-right-6 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-500/5 rounded-full blur-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 1 }}
      />

      <div className="relative">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
            {name}
          </span>
        </motion.h1>

        <motion.div className="relative" variants={itemVariants}>
          <motion.div
            className={`overflow-hidden relative ${
              shouldTruncate && !isExpanded ? "max-h-[4.5rem]" : ""
            }`}
            variants={descriptionVariants}
            animate={
              shouldTruncate
                ? isExpanded
                  ? "expanded"
                  : "collapsed"
                : "expanded"
            }
          >
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              {description}
            </p>

            {shouldTruncate && !isExpanded && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-10 sm:h-12 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-gray-900 dark:via-gray-900/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              />
            )}
          </motion.div>

          {shouldTruncate && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 sm:gap-2 mt-3 sm:mt-4 text-primary hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 group"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs sm:text-sm font-medium">
                {isExpanded ? "Show less" : "Read more"}
              </span>
              <motion.span
                className="material-symbols-outlined text-base sm:text-lg"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                expand_more
              </motion.span>
            </motion.button>
          )}
        </motion.div>

        <motion.div
          className="w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full mt-4 sm:mt-6 md:mt-8"
          initial={{ width: 0 }}
          animate={{ width: "3rem" }}
          transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <motion.div
        className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
          <span className="material-symbols-outlined text-sm sm:text-base">
            architecture
          </span>
          <span className="hidden xs:inline">Architectural Design</span>
          <span className="xs:hidden">Arch Design</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium">
          <span className="material-symbols-outlined text-sm sm:text-base">
            draw
          </span>
          <span className="hidden xs:inline">Detailed Plans</span>
          <span className="xs:hidden">Plans</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DesignHeader;
