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
      height: "6rem", // Increased slightly for better readability
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
    expanded: {
      height: "auto",
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const shouldTruncate = description.length > 250; // Increased threshold

  return (
    <motion.div
      className="mb-8 sm:mb-10 md:mb-14 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />

      <div className="relative">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            {name}
          </span>
        </motion.h1>

        <motion.div className="relative max-w-4xl" variants={itemVariants}>
          <motion.div
            className={`overflow-hidden relative ${
              shouldTruncate && !isExpanded ? "max-h-[6rem]" : ""
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
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light tracking-wide">
              {description}
            </p>

            {shouldTruncate && !isExpanded && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent dark:from-gray-900 dark:via-gray-900/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              />
            )}
          </motion.div>

          {shouldTruncate && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition-colors duration-300 group font-medium"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm uppercase tracking-wider">
                {isExpanded ? "Show less" : "Read full description"}
              </span>
              <motion.span
                className="material-symbols-outlined text-lg"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                expand_more
              </motion.span>
            </motion.button>
          )}
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-3 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700">
            Architectural Design
          </div>
          <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700">
            Premium Quality
          </div>
          <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700">
            Instant Download
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DesignHeader;
