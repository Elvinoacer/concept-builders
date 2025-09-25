'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { steps } from '@/lib/dummydata';

const HowItWorks = () => {
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 dark:text-white"
        >
          Your Journey to a New Home
        </motion.h2>

        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              className="bg-white dark:bg-gray-800/50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="material-symbols-outlined text-white text-3xl">
                  {step.icon}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 dark:text-gray-100">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden relative px-4">
          <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative flex items-start mb-12 last:mb-0"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center z-10 shadow-lg border-4 border-gray-50 dark:border-gray-900">
                <span className="material-symbols-outlined text-white text-4xl">
                  {step.icon}
                </span>
              </div>
              <div className="ml-6 pt-1">
                <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
