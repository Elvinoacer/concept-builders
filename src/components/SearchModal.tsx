"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("Any");
  const [styles, setStyles] = useState<string[]>([]);

  const router = useRouter();

  const handleStyleChange = (style: string) => {
    setStyles((prevStyles) =>
      prevStyles.includes(style)
        ? prevStyles.filter((s) => s !== style)
        : [...prevStyles, style]
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("search", keyword);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms !== "Any") params.set("bedrooms", bedrooms);
    if (styles.length > 0) params.set("styles", styles.join(","));

    router.push(`/design-showcase?${params.toString()}`);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 xs:p-3 sm:p-4 text-center safe-area-inset">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  duration: 0.2,
                }}
                className="relative w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl transform overflow-hidden rounded-xl xs:rounded-2xl bg-white dark:bg-gray-900 p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxHeight: "90vh",
                  marginTop: "env(safe-area-inset-top)",
                  marginBottom: "env(safe-area-inset-bottom)",
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 xs:mb-5 sm:mb-6">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                    Search Designs
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl xs:text-2xl">
                      close
                    </span>
                  </motion.button>
                </div>

                {/* Content - Scrollable */}
                <div
                  className="overflow-y-auto pr-1 -mr-1 pb-24" // Added pb-24 for padding at the bottom
                  style={{ maxHeight: "calc(90vh - 120px)" }}
                >
                  <div className="grid grid-cols-1 gap-4 xs:gap-5 sm:gap-6">
                    {/* Search Input */}
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl xs:text-2xl">
                        search
                      </span>
                      <input
                        className="w-full rounded-full border-transparent bg-gray-100 dark:bg-gray-800 py-2.5 xs:py-3 sm:py-3.5 pl-10 xs:pl-12 pr-4 xs:pr-6 text-sm xs:text-base text-slate-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Search by keyword..."
                        type="search"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoFocus
                      />
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="text-base xs:text-lg font-semibold mb-2 xs:mb-3 text-slate-800 dark:text-white">
                        Price Range
                      </h3>
                      <div className="flex items-center gap-2 xs:gap-3">
                        <input
                          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm xs:text-base h-10 xs:h-12 px-3 xs:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          placeholder="Min"
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <span className="text-gray-500 text-sm xs:text-base">
                          -
                        </span>
                        <input
                          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm xs:text-base h-10 xs:h-12 px-3 xs:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          placeholder="Max"
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <h3 className="text-base xs:text-lg font-semibold mb-2 xs:mb-3 text-slate-800 dark:text-white">
                        Bedrooms
                      </h3>
                      <div className="flex flex-wrap gap-1.5 xs:gap-2">
                        {["Any", "1", "2", "3", "4+"].map((num) => (
                          <motion.button
                            key={num}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 xs:px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm font-medium transition-all duration-200 ${
                              bedrooms === num
                                ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-lg"
                                : "bg-gray-200 dark:bg-gray-800 text-slate-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                            }`}
                            onClick={() => setBedrooms(num)}
                          >
                            {num}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Architectural Style */}
                    <div>
                      <h3 className="text-base xs:text-lg font-semibold mb-2 xs:mb-3 text-slate-800 dark:text-white">
                        Architectural Style
                      </h3>
                      <div className="space-y-1.5 xs:space-y-2">
                        {[
                          "Modern",
                          "Contemporary",
                          "Traditional",
                          "Coastal",
                          "Farmhouse",
                        ].map((style) => (
                          <motion.label
                            key={style}
                            className="flex items-center gap-2 xs:gap-3 text-sm xs:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors p-1.5 xs:p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            whileHover={{ x: 2 }}
                          >
                            <input
                              className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 w-4 h-4 xs:w-5 xs:h-5"
                              type="checkbox"
                              checked={styles.includes(style)}
                              onChange={() => handleStyleChange(style)}
                            />
                            <span className="select-none">{style}</span>
                          </motion.label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Button - Sticky Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 xs:p-5 sm:p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                  <motion.button
                    onClick={handleSearch}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-lg xs:rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-2.5 xs:py-3 sm:py-3.5 text-sm xs:text-base font-bold text-white transition-all duration-300 hover:from-blue-700 hover:to-cyan-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    Search Designs
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
