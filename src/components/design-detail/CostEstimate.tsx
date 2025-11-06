import { costEstimateIcons } from "@/lib/dummydata";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface CostEstimateProps {
  design: any;
  activeTier: string;
  currentEstimate: any;
}

const CostEstimate: React.FC<CostEstimateProps> = ({
  design,
  activeTier,
  currentEstimate,
}) => {
  const [openBreakdown, setOpenBreakdown] = useState(false);

  const handleToggleBreakdown = () => {
    setOpenBreakdown(!openBreakdown);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const breakdownVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  if (!currentEstimate) {
    return (
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
          No cost estimate available.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={`cost-estimate-${activeTier}`}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4 sm:mb-6 md:mb-8"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3">
          {currentEstimate.tier} Finish Estimate
        </h2>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400">
          Detailed breakdown of construction costs
        </p>
      </motion.div>

      <motion.div
        className={`p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border-2 transition-all duration-500 cursor-pointer ${
          openBreakdown
            ? "border-primary bg-gradient-to-r from-primary/5 to-blue-500/5 shadow-md sm:shadow-lg shadow-primary/10"
            : "border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/50 hover:border-primary/30 hover:shadow-lg sm:hover:shadow-xl"
        } ring-1 sm:ring-2 ring-primary/20`}
        whileHover={{ y: -2 }}
        onClick={handleToggleBreakdown}
      >
        <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
          <motion.div
            className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white shadow-md sm:shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-lg sm:text-xl md:text-2xl">
              {costEstimateIcons[currentEstimate.tier] ||
                costEstimateIcons[currentEstimate.name] ||
                "🏠"}
            </span>
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-4">
              <div className="flex-1 min-w-0">
                <motion.h3
                  className="font-bold text-base sm:text-lg md:text-xl text-slate-800 dark:text-white mb-1 sm:mb-2 line-clamp-1"
                  animate={{
                    color: openBreakdown ? "#3b82f6" : "",
                  }}
                >
                  {currentEstimate.tier} Finish
                </motion.h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                  {currentEstimate.description}
                </p>
                <motion.p
                  className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentEstimate.priceRange ||
                    `$${(currentEstimate.totalCost || currentEstimate.costBreakdown?.reduce((sum, item) => sum + parseFloat(item.cost), 0))?.toLocaleString()}`}
                </motion.p>
              </div>

              <motion.button
                className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleBreakdown();
                }}
              >
                <motion.span
                  animate={{ rotate: openBreakdown ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="material-symbols-outlined text-sm sm:text-base md:text-lg"
                >
                  expand_more
                </motion.span>
              </motion.button>
            </div>

            <AnimatePresence>
              {openBreakdown && (
                <motion.div
                  variants={breakdownVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <h4 className="font-semibold text-sm sm:text-base md:text-lg text-slate-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm sm:text-base">
                        analytics
                      </span>
                      Detailed Cost Breakdown
                    </h4>
                    <motion.ul
                      className="space-y-2 sm:space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {currentEstimate.costBreakdown?.map(
                        (item: any, itemIndex: number) => (
                          <motion.li
                            key={itemIndex}
                            className="flex justify-between items-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/50 dark:bg-gray-700/30 border border-gray-200/30 dark:border-gray-600/30 hover:bg-white dark:hover:bg-gray-700/50 transition-colors duration-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.1 + 0.3 }}
                            whileHover={{ x: 2 }}
                          >
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium truncate flex-1 pr-2">
                              {item.item}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm flex-shrink-0">
                              {item.cost}
                            </span>
                          </motion.li>
                        )
                      )}
                    </motion.ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CostEstimate;
