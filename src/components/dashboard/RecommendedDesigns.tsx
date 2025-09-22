'use client';
import React from 'react';
import { designs } from '@/lib/designs';
import DesignCard from '@/components/DesignCard';
import { motion } from 'framer-motion';

const RecommendedDesigns = () => {
  return (
    <section className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recommended for You</h3>
      <div className="flex overflow-x-auto space-x-6 pb-4">
        {designs.map((design, index) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[300px]"
          >
            <DesignCard design={design} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedDesigns;
