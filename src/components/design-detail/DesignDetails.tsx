"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DesignDetails({ description, planDetails, costBreakdown, totalEstimatedCost, faq, drawingSets, reviews }) {
  const [activeTab, setActiveTab] = useState("description");

  import { designDetailsTabs as tabs } from "@/lib/dummydata";

  return (
    <div className="mt-12">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? "text-[var(--primary-color)] border-[var(--primary-color)]"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500 border-transparent"
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "description" && <p className="text-gray-600 dark:text-gray-300 max-w-4xl">{description}</p>}
            {activeTab === "plan-details" && (
              <div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Detailed Specifications</h3>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Total Living Area: {planDetails.totalLivingArea}</li>
                  <li>Bedrooms: {planDetails.bedrooms}</li>
                  <li>Bathrooms: {planDetails.bathrooms}</li>
                  <li>Stories: {planDetails.stories}</li>
                  <li>Garage: {planDetails.garage}</li>
                  <li>Foundation Options: {planDetails.foundationOptions}</li>
                  <li>Roof Pitch: {planDetails.roofPitch}</li>
                  <li>Exterior Materials: {planDetails.exteriorMaterials}</li>
                </ul>
              </div>
            )}
            {activeTab === "construction-cost" && (
              <div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Estimated Construction Cost Breakdown</h3>
                <div className="space-y-2">
                  {costBreakdown.map((item, index) => (
                    <div key={index} className="cost-breakdown flex justify-between items-center text-sm py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-300">{item.item}</p>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{item.cost}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-right">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Total Estimated Cost:</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalEstimatedCost}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Note: Costs may vary based on location, materials, and labor rates</p>
                </div>
              </div>
            )}
            {activeTab === "faq-support" && (
              <div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faq.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{item.question}</h4>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "drawing-sets" && (
              <div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Available Drawing Sets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {drawingSets.map((set, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-bold text-lg dark:text-white">{set.name}</h4>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">{set.description}</p>
                      <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                        {set.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                      <p className="text-[var(--primary-color)] font-bold mt-3">{set.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Customer Reviews</h3>
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(Math.floor(review.rating))].map((_, i) => (
                            <span key={i} className="material-symbols-outlined">star</span>
                          ))}
                          {review.rating % 1 !== 0 && <span className="material-symbols-outlined">star_half</span>}
                        </div>
                        <p className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-200">{review.rating} out of 5</p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{review.text}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">- {review.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
