
'use client';

import { motion } from 'framer-motion';

const FilterAside = () => {
  return (
    <motion.aside
      className="w-full md:pr-8"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
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
            <button className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-400 text-white">Any</button>
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
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">Size (sq. ft.)</h3>
          <input className="w-full" max="5000" min="500" step="100" type="range"/>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>500</span>
            <span>5000+</span>
          </div>
        </div>
        <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 py-2.5 font-bold text-white transition hover:from-blue-700 hover:to-cyan-500">Apply Filters</button>
      </div>
    </motion.aside>
  );
};

export default FilterAside;
