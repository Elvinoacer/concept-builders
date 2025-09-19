"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function PurchaseSidebar({ costBreakdown, totalEstimatedCost, designCostBreakdown, totalDesignCost }) {
  const [activeTab, setActiveTab] = useState("standard");
  const [includeBuildingCost, setIncludeBuildingCost] = useState(true);

  const tabs = [
    { id: "basic", label: "Basic" },
    { id: "standard", label: "Standard" },
    { id: "luxury", label: "Luxury" },
  ];

  

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Best Seller</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">New Design</span>
          </div>
          <p className="text-2xl font-bold text-[var(--primary-color)]">$995.00 - $1,595.00</p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="file-type">File Type</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm rounded-md" id="file-type" name="file-type">
                <option>PDF</option>
                <option>CAD</option>
                <option>REVIT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="drawing-set">Drawing Set</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm rounded-md" id="drawing-set" name="drawing-set">
                <option>Full Set</option>
                <option>Study Set</option>
                <option>Custom Set</option>
              </select>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-[#0a6e9c] text-white text-base font-bold tracking-wide hover:bg-opacity-90 transition-all">
              Buy Now
            </Button>
            <Button className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white text-base font-bold tracking-wide hover:bg-gray-300 dark:hover:bg-gray-500 transition-all">
              <span className="material-symbols-outlined"> shopping_cart </span>
              Add to Cart
            </Button>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Secure payment via Stripe & PayPal</p>
          </div>
          <div className="mt-4 flex justify-center gap-4 text-gray-400 dark:text-gray-500">
            <span className="text-xs font-semibold">100% Price Guarantee</span>
            <span className="text-xs font-semibold">Modification Service</span>
          </div>
          <div className="mt-6 flex justify-center items-center gap-2">
            <span className="text-sm font-medium dark:text-gray-300">Share:</span>
            <div className="flex gap-2">
              <a className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" href="#"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.8.35-1.65.58-2.5.68.9-.54 1.6-1.4 1.9-2.4-.85.5-1.8 1.1-2.8 1.3-.8-1.1-2-1.8-3.3-1.8-2.5 0-4.5 2-4.5 4.5 0 .35.04.7.12 1.03-3.7-.2-7-1.9-9.2-4.6-.4.6-.6 1.4-.6 2.2 0 1.5.8 2.9 1.9 3.7-.7 0-1.4-.2-2-.6v.05c0 2.1 1.5 3.9 3.5 4.3-.35.1-.7.15-1.1.15-.28 0-.55-.03-.8-.08.55 1.7 2.15 3 4.05 3-1.5 1.2-3.4 1.8-5.5 1.8-.35 0-.7-.02-1.04-.06 2 1.2 4.3 2 6.8 2 8.1 0 12.5-6.7 12.5-12.5 0-.2 0-.4 0-.6.85-.6 1.55-1.4 2.15-2.2z"></path></svg></a>
              <a className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" href="#"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.53-13.06l-1.3 1.3c-.39.39-.39 1.02 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0l4.24-4.24c.39-.39.39-1.02 0-1.41l-1.3-1.3c-.39-.39-1.02-.39-1.41 0l-3.54 3.54c-.38.38-1.02.38-1.41 0z"></path></svg></a>
              <a className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" href="#"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path></svg></a>
              <a className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" href="#"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"></path></svg></a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Cost Estimate</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Estimated Building Cost</p>
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="includeBuildingCost" className="text-sm font-medium text-gray-700 dark:text-gray-300">Include building cost</label>
            <button
              id="includeBuildingCost"
              onClick={() => setIncludeBuildingCost(!includeBuildingCost)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                includeBuildingCost ? "bg-[var(--primary-color)]" : "bg-gray-300 dark:bg-gray-600"
              }`}>
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  includeBuildingCost ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {includeBuildingCost ? (
            <>
              <div className="flex justify-center mb-4 border-b dark:border-gray-700" role="tablist">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
                      activeTab === tab.id
                        ? "text-white font-bold"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                    style={{
                      background: activeTab === tab.id
                        ? tab.id === 'basic'
                          ? 'linear-gradient(to right, #6b7280, #4b5563)'
                          : tab.id === 'standard'
                          ? 'linear-gradient(to right, #1193d4, #0a6e9c)'
                          : 'linear-gradient(to right, #1f2937, #111827)'
                        : 'transparent',
                    }}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`tabpanel-${tab.id}`}
                  >
                    {activeTab === tab.id && <span className="sr-only">Selected tab: </span>}
                    {tab.label}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  id={`tabpanel-${activeTab}`}
                  role="tabpanel"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4">
                    {costBreakdown[activeTab].map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300">{item.item}</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{item.cost}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-right">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Total Estimated Cost:</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalEstimatedCost[activeTab]}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Regional variations may apply</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <div className="space-y-4">
              {designCostBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300">{item.item}</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{item.cost}</p>
                </div>
              ))}
              <div className="mt-6 text-right">
                <p className="text-gray-600 dark:text-gray-300 text-sm">Total Design Cost:</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalDesignCost}</p>
              </div>
            </div>
          )}
          <Button className="w-full mt-6 flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-gray-800 text-white text-base font-bold tracking-wide hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all">
            <span className="material-symbols-outlined"> request_quote </span>
            Get Detailed Quote
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
