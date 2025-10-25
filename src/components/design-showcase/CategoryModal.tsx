'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onApply, initialSelectedCategories }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelectedCategories);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?forFilters=true');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleToggleCategory = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]
    );
  };

  const filteredCategories = categories.filter(category =>
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Select Categories</h2>
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm h-12 px-4 mb-4"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredCategories.map(category => (
                <label key={category.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleToggleCategory(category.name)}
                  />
                  {category.name}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 text-white"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;
