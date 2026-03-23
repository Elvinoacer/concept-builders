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
            initial={{ scale: 0.9, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            className="bg-card backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xs xs:max-w-sm sm:max-w-md mx-auto p-6 sm:p-8 border-2 border-cb-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6 text-gold uppercase tracking-tight">
              Select Categories
            </h2>
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full rounded-xl border-2 border-cb-border bg-surface text-cream text-sm h-12 px-4 mb-4 focus:border-gold focus:ring-0 transition-all duration-300 font-medium placeholder:text-muted"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredCategories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-cb-border/30 bg-surface/50 hover:border-gold/30 hover:bg-surface cursor-pointer transition-all duration-300 group"
                >
                  <input
                    type="checkbox"
                    className="rounded border-2 border-cb-border text-gold focus:ring-gold focus:ring-offset-ink w-5 h-5 bg-ink"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleToggleCategory(category.name)}
                  />
                  <span className="text-xs sm:text-sm text-cream font-bold uppercase tracking-wider group-hover:text-gold transition-colors">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
              <motion.button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-surface border-2 border-cb-border text-cream-dim text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-ink transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleApply}
                className="px-5 py-2.5 rounded-xl bg-gold text-ink text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg shadow-gold/20 hover:bg-gold-light transition-all duration-300"
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
