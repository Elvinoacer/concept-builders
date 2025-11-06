"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  isFeatured: boolean;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedCategories: string[]) => void;
  initialSelectedCategories: string[];
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialSelectedCategories,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialSelectedCategories
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories?forFilters=true");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleToggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = () => {
    onApply(selectedCategories);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 xs:p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl w-full max-w-xs xs:max-w-sm sm:max-w-md mx-auto p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-slate-800 dark:text-white">
              Select Categories
            </h2>
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm h-10 sm:h-12 px-3 sm:px-4 mb-3 sm:mb-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-1 sm:space-y-2 pr-2 scrollbar-thin">
              {filteredCategories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 hover:border-primary/30 cursor-pointer transition-all duration-300"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary w-4 h-4 sm:w-5 sm:h-5"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleToggleCategory(category.name)}
                  />
                  <span className="text-xs sm:text-sm text-slate-800 dark:text-gray-200 font-medium">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 sm:gap-4 mt-4 sm:mt-6">
              <motion.button
                onClick={onClose}
                className="px-3 sm:px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-gray-200 text-xs sm:text-sm font-medium transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleApply}
                className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-xs sm:text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;
