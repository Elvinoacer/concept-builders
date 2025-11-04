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

  // Reset breakdown state when activeTier changes
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
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          No cost estimate available.
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={`cost-estimate-${activeTier}`} // Unique key for each tier
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
            {currentEstimate.tier} Finish Estimate
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Detailed breakdown of construction costs
          </p>
        </motion.div>

        {/* Current Estimate Card */}
        <motion.div
          className={`p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer ${
            openBreakdown
              ? "border-primary bg-gradient-to-r from-primary/5 to-blue-500/5 shadow-lg shadow-primary/10"
              : "border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/50 hover:border-primary/30 hover:shadow-xl"
          } ring-2 ring-primary/20`}
          whileHover={{ y: -4 }}
          onClick={handleToggleBreakdown}
        >
          <div className="flex items-start gap-6">
            {/* Icon */}
            <motion.div
              className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-2xl">
                {costEstimateIcons[currentEstimate.tier] ||
                  costEstimateIcons[currentEstimate.name] ||
                  "🏠"}
              </span>
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <motion.h3
                    className="font-bold text-xl text-slate-800 dark:text-white mb-2"
                    animate={{
                      color: openBreakdown ? "#3b82f6" : "",
                    }}
                  >
                    {currentEstimate.tier} Finish
                  </motion.h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-3">
                    {currentEstimate.description}
                  </p>
                  <motion.p
                    className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentEstimate.priceRange ||
                      `$${(currentEstimate.totalCost || currentEstimate.costBreakdown?.reduce((sum, item) => sum + parseFloat(item.cost), 0))?.toLocaleString()}`}
                  </motion.p>
                </div>

                {/* Toggle Button */}
                <motion.button
                  className="flex-shrink-0 w-10 h-10 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleBreakdown();
                  }}
                >
                  <motion.span
                    animate={{ rotate: openBreakdown ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="material-symbols-outlined text-lg"
                  >
                    expand_more
                  </motion.span>
                </motion.button>
              </div>

              {/* Cost Breakdown */}
              <AnimatePresence>
                {openBreakdown && (
                  <motion.div
                    variants={breakdownVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="overflow-hidden"
                  >
                    <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                      <h4 className="font-semibold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                          analytics
                        </span>
                        Detailed Cost Breakdown
                      </h4>
                      <motion.ul
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {currentEstimate.costBreakdown?.map(
                          (item: any, itemIndex: number) => (
                            <motion.li
                              key={itemIndex}
                              className="flex justify-between items-center p-3 rounded-xl bg-white/50 dark:bg-gray-700/30 border border-gray-200/30 dark:border-gray-600/30 hover:bg-white dark:hover:bg-gray-700/50 transition-colors duration-300"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIndex * 0.1 + 0.3 }}
                              whileHover={{ x: 4 }}
                            >
                              <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {item.item}
                              </span>
                              <span className="font-bold text-slate-800 dark:text-white">
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
      </motion.div>{" "}
    </>
  );
};

export default CostEstimate;
