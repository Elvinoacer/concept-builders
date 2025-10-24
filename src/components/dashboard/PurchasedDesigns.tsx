'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSearch } from '@/lib/SearchContext';
import { useSession } from 'next-auth/react';

const PurchasedDesigns = ({ searchQuery }: { searchQuery: string }) => {
  const { data: session } = useSession();
  const { resultsRef } = useSearch();
  const [purchasedDesigns, setPurchasedDesigns] = useState([]);

  useEffect(() => {
    const fetchPurchasedDesigns = async () => {
      try {
        const response = await fetch('/api/purchases');
        const data = await response.json();
        setPurchasedDesigns(data);
      } catch (error) {
        console.error('Error fetching purchased designs:', error);
      }
    };

    if (session) {
      fetchPurchasedDesigns();
    }
  }, [session]);

  const filteredDesigns = purchasedDesigns.filter(design =>
    design.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <section ref={resultsRef as React.RefObject<HTMLDivElement>}>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Purchased Designs</h3>
      {filteredDesigns.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">You haven't purchased any designs yet.</p>
          <a href="/designs" className="text-blue-600 hover:underline mt-2 inline-block">Explore Designs</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative h-56">
                <Image
                  src={design.files[0]?.url || '/images/category-placeholder.png'}
                  alt={design.name}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-5">
                  <h4 className="text-2xl font-bold text-white shadow-black/50 shadow-text-lg">{design.name}</h4>
                  <p className="text-sm text-gray-200 shadow-black/50 shadow-text-sm">Purchased on: {new Date(design.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-5">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Purchased Package</p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                    <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">description</span>
                    <div className="ml-4">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">Digital Download</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
                  <button className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-5 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-bold hover:shadow-lg transition-shadow text-base">
                    <span className="material-symbols-outlined">download</span>
                    Download Files
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-5 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-base">
                    <span className="material-symbols-outlined">receipt_long</span>
                    View Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PurchasedDesigns;