"use client";

import { motion } from "framer-motion";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryModal from "./CategoryModal";

interface FilterAsideProps {
  onClose?: () => void;
  searchParams: ReadonlyURLSearchParams;
  updateSearchParams: (newParams: Record<string, string | null>) => void;
  handleClearFilters: () => void;
}

const FilterAside: React.FC<FilterAsideProps> = ({
  onClose,
  searchParams,
  updateSearchParams,
  handleClearFilters,
}) => {
  const [priceType, setPriceType] = useState(
    searchParams.get("priceType") || "design"
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(
    searchParams.get("bedrooms") || "Any"
  );
  const [styles, setStyles] = useState(
    searchParams.get("styles")?.split(",") || []
  );
  const [minSize, setMinSize] = useState(searchParams.get("minSize") || "500");
  const [maxSize, setMaxSize] = useState(searchParams.get("maxSize") || "5000");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [localChanges, setLocalChanges] = useState(false);

  useEffect(() => {
    setPriceType(searchParams.get("priceType") || "design");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setBedrooms(searchParams.get("bedrooms") || "Any");
    setStyles(searchParams.get("styles")?.split(",") || []);
    setMinSize(searchParams.get("minSize") || "500");
    setMaxSize(searchParams.get("maxSize") || "5000");
    setLocalChanges(false);
  }, [searchParams]);

  const handlePriceTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPriceType = e.target.value;
    setPriceType(newPriceType);
    setLocalChanges(true);
  };

  const handleStyleChange = (style: string, isChecked: boolean) => {
    let newStyles = [...styles];
    if (isChecked) {
      newStyles.push(style);
    } else {
      newStyles = newStyles.filter((s) => s !== style);
    }
    setStyles(newStyles);
    setLocalChanges(true);
  };

  const handleApplyFilters = () => {
    updateSearchParams({
      minPrice: minPrice,
      maxPrice: maxPrice,
      bedrooms: bedrooms === "Any" ? null : bedrooms,
      styles: styles.length > 0 ? styles.join(",") : null,
      minSize: minSize,
      maxSize: maxSize,
      priceType: priceType,
    });
    setLocalChanges(false);
  };

  const handleClear = () => {
    setPriceType("design");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("Any");
    setStyles([]);
    setMinSize("500");
    setMaxSize("5000");
    setLocalChanges(false);
    handleClearFilters();
  };

  const architecturalStyles = [
    "Modern",
    "Contemporary",
    "Traditional",
    "Minimalist",
    "Industrial",
    "Scandinavian",
    "Mediterranean",
    "Victorian",
    "Colonial",
    "Craftsman",
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <motion.aside
        className="w-full md:pr-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="space-y-8 p-1">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between pb-4 border-b border-gray-200/60 dark:border-gray-700/60"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Filters
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Refine your design search
              </p>
            </div>
            <motion.button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </motion.button>
          </motion.div>

          {/* Price Type */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-primary">
                attach_money
              </span>
              Price Type
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "design",
                  label: "Design Cost",
                  icon: "design_services",
                },
                {
                  value: "building",
                  label: "Building Cost",
                  icon: "architecture",
                },
              ].map((option) => (
                <motion.label
                  key={option.value}
                  className={`relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    priceType === option.value
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-primary/50"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="priceType"
                    value={option.value}
                    checked={priceType === option.value}
                    onChange={handlePriceTypeChange}
                    className="sr-only"
                  />
                  <span className="material-symbols-outlined text-2xl mb-2">
                    {option.icon}
                  </span>
                  <span className="text-sm font-medium text-center">
                    {option.label}
                  </span>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Price Range */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-primary">
                payments
              </span>
              Price Range
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    trending_down
                  </span>
                  <input
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-gray-100 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Min Price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setLocalChanges(true);
                    }}
                  />
                </div>
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    trending_up
                  </span>
                  <input
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-gray-100 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Max Price"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setLocalChanges(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bedrooms */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-primary">
                bed
              </span>
              Bedrooms
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Any", "1", "2", "3", "4+"].map((option) => (
                <motion.button
                  key={option}
                  onClick={() => {
                    setBedrooms(option);
                    setLocalChanges(true);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    bedrooms === option
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25"
                      : "bg-white/80 dark:bg-gray-800/80 text-slate-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Architectural Style */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-primary">
                  styles
                </span>
                Architectural Style
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {styles.length} selected
              </span>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
              {architecturalStyles.slice(0, 6).map((style) => (
                <motion.label
                  key={style}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 hover:border-primary/30 cursor-pointer transition-all duration-300 group"
                  whileHover={{ x: 4 }}
                >
                  <div className="relative">
                    <input
                      className="sr-only"
                      type="checkbox"
                      checked={styles.includes(style)}
                      onChange={(e) =>
                        handleStyleChange(style, e.target.checked)
                      }
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                        styles.includes(style)
                          ? "bg-primary border-primary"
                          : "border-gray-300 dark:border-gray-600 group-hover:border-primary"
                      }`}
                    >
                      {styles.includes(style) && (
                        <span className="material-symbols-outlined text-white text-sm">
                          check
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-slate-800 dark:text-gray-200 font-medium">
                    {style}
                  </span>
                </motion.label>
              ))}
            </div>
            <motion.button
              onClick={() => setIsCategoryModalOpen(true)}
              className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="material-symbols-outlined text-lg">add</span>
              More Categories
            </motion.button>
          </motion.div>

          {/* Size Range */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-primary">
                square_foot
              </span>
              Size Range
              <span className="text-sm font-normal text-primary ml-auto">
                {minSize} - {maxSize} sq ft
              </span>
            </h3>
            <div className="space-y-6">
              <div className="relative py-4">
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <motion.div
                    className="absolute h-2 bg-gradient-to-r from-primary to-blue-500 rounded-full"
                    initial={false}
                    animate={{
                      left: `${(parseInt(minSize) / 5000) * 100}%`,
                      right: `${100 - (parseInt(maxSize) / 5000) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
                  <span>500 sq ft</span>
                  <span>5000 sq ft</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">
                    Min Size
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="5000"
                    value={minSize}
                    onChange={(e) => {
                      setMinSize(e.target.value);
                      setLocalChanges(true);
                    }}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">
                    Max Size
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="5000"
                    value={maxSize}
                    onChange={(e) => {
                      setMaxSize(e.target.value);
                      setLocalChanges(true);
                    }}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-3 pt-4 border-t border-gray-200/60 dark:border-gray-700/60"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleClear}
              className="flex-1 py-3.5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 font-semibold text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Clear
            </motion.button>
            <motion.button
              onClick={handleApplyFilters}
              disabled={!localChanges}
              className={`flex-1 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                localChanges
                  ? "bg-gradient-to-r from-primary to-blue-600 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 cursor-pointer"
                  : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
              }`}
              whileHover={localChanges ? { scale: 1.02 } : {}}
              whileTap={localChanges ? { scale: 0.98 } : {}}
            >
              <span className="material-symbols-outlined text-lg">check</span>
              Apply
            </motion.button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onApply={setStyles}
        initialSelectedCategories={styles}
      />
    </>
  );
};

export default FilterAside;
