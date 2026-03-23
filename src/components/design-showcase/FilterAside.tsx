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
        className="w-full md:pr-4 lg:pr-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="space-y-6 sm:space-y-8 p-1">
          <motion.div
            className="flex items-center justify-between pb-6 border-b-2 border-cb-border"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gold uppercase tracking-tight">
                Filters
              </h2>
              <p className="text-xs sm:text-sm text-cream-dim font-medium mt-1 uppercase tracking-widest">
                Refine Your Search
              </p>
            </div>
            <motion.button
              onClick={onClose}
              className="md:hidden p-3 rounded-xl bg-surface border-2 border-cb-border text-gold hover:bg-ink transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">
                close
              </span>
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-base sm:text-lg font-black mb-4 text-gold flex items-center gap-2 uppercase tracking-wide">
              <span className="material-symbols-outlined text-xl text-gold">
                attach_money
              </span>
              Price Type
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
                  className={`relative flex flex-col items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-500 ${
                    priceType === option.value
                      ? "border-gold bg-gold/10 shadow-2xl shadow-gold/10"
                      : "border-cb-border bg-surface hover:border-gold/40"
                  }`}
                  whileHover={{ y: -3, scale: 1.02 }}
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
                  <span className="material-symbols-outlined text-xl sm:text-2xl mb-1 sm:mb-2">
                    {option.icon}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-center">
                    {option.label}
                  </span>
                </motion.label>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-base sm:text-lg font-black mb-4 text-gold flex items-center gap-2 uppercase tracking-wide">
              <span className="material-symbols-outlined text-xl text-gold">
                payments
              </span>
              Price Range
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold/60 text-lg">
                    trending_down
                  </span>
                  <input
                    className="w-full rounded-xl border-2 border-cb-border bg-surface py-3.5 pl-11 pr-4 text-sm text-cream placeholder:text-muted focus:border-gold focus:ring-0 transition-all duration-300 font-bold"
                    placeholder="Min Price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setLocalChanges(true);
                    }}
                  />
                </div>
                <div className="relative w-full">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold/60 text-lg">
                    trending_up
                  </span>
                  <input
                    className="w-full rounded-xl border-2 border-cb-border bg-surface py-3.5 pl-11 pr-4 text-sm text-cream placeholder:text-muted focus:border-gold focus:ring-0 transition-all duration-300 font-bold"
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

          <motion.div variants={itemVariants}>
            <h3 className="text-base sm:text-lg font-black mb-4 text-gold flex items-center gap-2 uppercase tracking-wide">
              <span className="material-symbols-outlined text-xl text-gold">
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
                  className={`px-5 py-3 rounded-xl text-sm font-black transition-all duration-500 uppercase tracking-widest ${
                    bedrooms === option
                      ? "bg-gold text-ink shadow-2xl shadow-gold/20"
                      : "bg-surface text-cream-dim border-2 border-cb-border hover:border-gold/40 hover:text-gold"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-black text-gold flex items-center gap-2 uppercase tracking-wide">
                <span className="material-symbols-outlined text-xl text-gold">
                  design_services
                </span>
                Style
              </h3>
              <span className="text-[10px] font-black text-gold/60 uppercase tracking-widest">
                {styles.length} Selected
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {architecturalStyles.slice(0, 8).map((style) => (
                <motion.label
                  key={style}
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-cb-border/30 bg-surface/50 hover:border-gold/30 hover:bg-surface cursor-pointer transition-all duration-300 group"
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
                          ? "bg-gold border-gold"
                          : "border-cb-border group-hover:border-gold"
                      }`}
                    >
                      {styles.includes(style) && (
                        <span className="material-symbols-outlined text-ink text-xs sm:text-sm font-black">
                          check
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-cream font-bold uppercase tracking-wider group-hover:text-gold transition-colors">
                    {style}
                  </span>
                </motion.label>
              ))}
            </div>
            <motion.button
              onClick={() => setIsCategoryModalOpen(true)}
              className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-cb-border text-gold/60 hover:border-gold hover:text-gold transition-all duration-500 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="material-symbols-outlined text-xl">
                add
              </span>
              <span>More Categories</span>
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-base sm:text-lg font-black mb-4 text-gold flex items-center gap-2 uppercase tracking-wide">
              <span className="material-symbols-outlined text-xl text-gold">
                square_foot
              </span>
              Size Range
              <span className="text-xs font-black text-gold ml-auto bg-gold/10 px-2 py-1 rounded-lg">
                {minSize} - {maxSize} sq ft
              </span>
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div className="relative py-4">
                <div className="relative h-2 bg-surface rounded-full border border-cb-border">
                  <motion.div
                    className="absolute h-full bg-gold rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    initial={false}
                    animate={{
                      left: `${(parseInt(minSize) / 5000) * 100}%`,
                      right: `${100 - (parseInt(maxSize) / 5000) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black text-gold/40 mt-4 uppercase tracking-[0.2em]">
                  <span>500 sq ft</span>
                  <span>5000 sq ft</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gold/60 mb-2 block uppercase tracking-widest">
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
                    className="w-full rounded-xl border-2 border-cb-border bg-surface py-3 px-4 text-sm text-cream font-bold focus:border-gold focus:ring-0 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gold/60 mb-2 block uppercase tracking-widest">
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
                    className="w-full rounded-xl border-2 border-cb-border bg-surface py-3 px-4 text-sm text-cream font-bold focus:border-gold focus:ring-0 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex gap-4 pt-6 border-t-2 border-cb-border"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleClear}
              className="flex-1 py-4 rounded-xl bg-surface border-2 border-cb-border font-black text-cream-dim hover:bg-ink hover:text-gold transition-all duration-500 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-xl">
                refresh
              </span>
              <span>Reset</span>
            </motion.button>
            <motion.button
              onClick={handleApplyFilters}
              disabled={!localChanges}
              className={`flex-1 py-4 rounded-xl font-black text-ink transition-all duration-500 flex items-center justify-center gap-2 uppercase tracking-widest text-xs ${
                localChanges
                  ? "bg-gold shadow-2xl shadow-gold/20 hover:bg-gold-light cursor-pointer"
                  : "bg-surface text-muted cursor-not-allowed opacity-50"
              }`}
              whileHover={localChanges ? { scale: 1.05 } : {}}
              whileTap={localChanges ? { scale: 0.95 } : {}}
            >
              <span className="material-symbols-outlined text-xl">
                check
              </span>
              <span>Apply</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.aside>

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
