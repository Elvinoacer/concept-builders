
'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="relative mx-auto mt-20 max-w-2xl rounded-lg bg-white p-8 shadow-xl dark:bg-gray-900 overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Search Designs</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-2xl"> search </span>
                <input className="w-full rounded-full border-transparent bg-gray-100 dark:bg-gray-800 py-3 pl-12 pr-6 text-base text-slate-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-primary shadow-sm" placeholder="Search by keyword..." type="search"/>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm h-12 px-4" placeholder="Min" type="number"/>
                  <span className="text-gray-500">-</span>
                  <input className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm h-12 px-4" placeholder="Max" type="number"/>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">Bedrooms</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800 text-slate-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700">Any</button>
                  <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800 text-slate-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700">1</button>
                  <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800 text-slate-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700">2</button>
                  <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800 text-slate-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700">3</button>
                  <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800 text-slate-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700">4+</button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">Architectural Style</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><input className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary" type="checkbox"/>Modern</label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><input className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary" type="checkbox"/>Contemporary</label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><input className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary" type="checkbox"/>Traditional</label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><input className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary" type="checkbox"/>Coastal</label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><input className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary" type="checkbox"/>Farmhouse</label>
                </div>
              </div>
              <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 py-3 font-bold text-white transition hover:from-blue-700 hover:to-cyan-500">Search</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
