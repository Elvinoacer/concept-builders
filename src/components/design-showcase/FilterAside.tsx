"use client";

import { motion } from "framer-motion";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface FilterAsideProps {
  onClose?: () => void;
  searchParams: ReadonlyURLSearchParams;
  updateSearchParams: (newParams: Record<string, string | null>) => void;
  handleClearFilters: () => void;
}

import CategoryModal from "./CategoryModal";

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
  const [maxSize, setMaxSize] = useState(searchParams.get("maxSize") || "500");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    setPriceType(searchParams.get("priceType") || "design");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setBedrooms(searchParams.get("bedrooms") || "Any");
    setStyles(searchParams.get("styles")?.split(",") || []);
    setMinSize(searchParams.get("minSize") || "500");
    setMaxSize(searchParams.get("maxSize") || "500");
  }, [searchParams]);

  const handlePriceTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPriceType = e.target.value;
    setPriceType(newPriceType);
    updateSearchParams({ priceType: newPriceType });
  };

  const handleStyleChange = (style: string, isChecked: boolean) => {
    let newStyles = [...styles];
    if (isChecked) {
      newStyles.push(style);
    } else {
      newStyles = newStyles.filter((s) => s !== style);
    }
    setStyles(newStyles);
  };

  const handleApplyFilters = () => {
    updateSearchParams({
      minPrice: minPrice,
      maxPrice: maxPrice,
      bedrooms: bedrooms === "Any" ? null : bedrooms,
      styles: styles.length > 0 ? styles.join(",") : null,
      minSize: minSize,
      maxSize: maxSize,
    });
  };

  const handleClear = () => {
    setPriceType("design");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("Any");
    setStyles([]);
    setMinSize("500");
    setMaxSize("500");
    handleClearFilters();
  };

  return (
    <motion.aside
      className="w-full md:pr-8"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Filters
          </h2>
          <button onClick={onClose} className="md:hidden">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">
            Price Range
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="designCost"
                name="priceType"
                value="design"
                checked={priceType === "design"}
                onChange={handlePriceTypeChange}
              />
              <label htmlFor="designCost">Design Cost</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="buildingCost"
                name="priceType"
                value="building"
                checked={priceType === "building"}
                onChange={handlePriceTypeChange}
              />
              <label htmlFor="buildingCost">Building Cost</label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm h-12 px-4"
              placeholder="Min Price"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-gray-500">-</span>
            <input
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm h-12 px-4"
              placeholder="Max Price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">
            Bedrooms
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Any", "1", "2", "3", "4+"].map((option) => (
              <button
                key={option}
                onClick={() => setBedrooms(option)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  bedrooms === option
                    ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-slate-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">
            Architectural Style
          </h3>
          <div className="space-y-2">
            {styles.slice(0, 5).map((style) => (
              <label
                key={style}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <input
                  className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                  type="checkbox"
                  checked={styles.includes(style)}
                  onChange={(e) => handleStyleChange(style, e.target.checked)}
                />
                {style}
              </label>
            ))}
          </div>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
          >
            More Categories
          </button>
        </div>
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onApply={setStyles}
          initialSelectedCategories={styles}
        />
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">
            Size (sq ft)
          </h3>
          <div className="relative">
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={maxSize}
              onChange={(e) => setMaxSize(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 range-slider"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>500</span>
              <span>{maxSize} sq ft</span>
              <span>5000</span>
            </div>
          </div>
        </div>

        <style jsx>{`
          .range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(to right, #2563eb, #0891b2);
            cursor: pointer;
            margin-top: -8px;
          }

          .range-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(to right, #2563eb, #0891b2);
            cursor: pointer;
          }
        `}</style>
        <div className="flex gap-4">
          <button
            onClick={handleClear}
            className="w-full rounded-lg bg-gray-200 dark:bg-gray-700 py-3 font-bold text-slate-800 dark:text-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Clear
          </button>
          <button
            onClick={handleApplyFilters}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 py-3 font-bold text-white transition hover:opacity-90"
          >
            Apply
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default FilterAside;
