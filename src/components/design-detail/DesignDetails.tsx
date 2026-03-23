"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { designDetailsTabs as tabs } from "@/lib/dummydata";

export function DesignDetails({ description, planDetails, costBreakdown, totalEstimatedCost, faq, drawingSets, reviews }: any) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-12">
      <div className="border-b border-cb-border">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors duration-300 ${activeTab === tab.id
                  ? "text-gold border-gold"
                  : "text-muted hover:text-cream hover:border-muted border-transparent"
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
            {activeTab === "description" && <p className="text-cream-dim max-w-4xl leading-relaxed">{description}</p>}
            {activeTab === "plan-details" && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-cream">Detailed Specifications</h3>
                <ul className="list-disc pl-5 text-cream-dim space-y-2 leading-relaxed">
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
                <h3 className="text-xl font-bold mb-4 text-cream">Estimated Construction Cost Breakdown</h3>
                <div className="space-y-2">
                  {costBreakdown.map((item: any, index: number) => (
                    <div key={index} className="cost-breakdown flex justify-between items-center text-sm py-3 px-4 border-b border-cb-border bg-surface/50 rounded-lg mb-2">
                      <p className="text-cream-dim">{item.item}</p>
                      <p className="font-bold text-cream">{item.cost}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-right p-6 bg-card rounded-2xl border border-cb-border shadow-2xl">
                  <p className="text-cream-dim text-sm font-bold">Total Estimated Cost:</p>
                  <p className="text-4xl font-black text-gold mt-1">{totalEstimatedCost}</p>
                  <p className="text-xs text-muted mt-3">Note: Costs may vary based on location, materials, and labor rates</p>
                </div>
              </div>
            )}
            {activeTab === "faq-support" && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-cream">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  {faq.map((item: any, index: number) => (
                    <div key={index} className="bg-surface/50 p-6 rounded-2xl border border-cb-border">
                      <h4 className="font-bold text-cream text-lg mb-2">{item.question}</h4>
                      <p className="text-cream-dim leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "drawing-sets" && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-cream">Available Drawing Sets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {drawingSets.map((set: any, index: number) => (
                    <div key={index} className="bg-card border border-cb-border rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:border-gold/30">
                      <h4 className="font-bold text-xl text-cream mb-2">{set.name}</h4>
                      <p className="text-cream-dim mb-4 line-clamp-2">{set.description}</p>
                      <ul className="list-disc pl-5 text-muted mb-4 space-y-1">
                        {set.features.map((feature: string, i: number) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                      <p className="text-gold font-black text-2xl">{set.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-cream">Customer Reviews</h3>
                <div className="space-y-6">
                  {reviews.map((review: any, index: number) => (
                    <div key={index} className="border-b border-cb-border pb-8 last:border-0">
                      <div className="flex items-center mb-4">
                        <div className="flex text-gold">
                          {[...Array(Math.floor(review.rating))].map((_, i) => (
                            <span key={i} className="material-symbols-outlined fill-current">star</span>
                          ))}
                          {review.rating % 1 !== 0 && <span className="material-symbols-outlined">star_half</span>}
                        </div>
                        <p className="ml-3 text-sm font-bold text-cream-dim">{review.rating} out of 5</p>
                      </div>
                      <p className="text-cream leading-relaxed italic">"{review.text}"</p>
                      <p className="text-sm text-muted mt-3 font-bold">- {review.author}</p>
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
