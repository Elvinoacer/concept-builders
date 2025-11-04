"use client";

import React from "react";
import { motion } from "framer-motion";
import { steps } from "@/lib/dummydata";
import { useRouter } from "next/navigation";
const HowItWorks = () => {
  const router = useRouter();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    offscreen: {
      y: 60,
      opacity: 0,
      scale: 0.95,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 0.8,
      },
    },
  };

  const stepNumberVariants = {
    offscreen: { scale: 0, rotate: -180 },
    onscreen: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2,
      },
    },
  };

  return (
    <section className="relative py-16 md:py-24 lg:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-10 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Follow our simple process to bring your dream home to life with ease
            and confidence
          </p>
        </motion.div>

        {/* Desktop View - Enhanced */}
        <motion.div
          className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
              className="group relative"
            >
              {/* Connecting Lines */}
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 z-0 group-hover:from-blue-500/50 group-hover:to-cyan-400/50 transition-all duration-300" />
              )}

              <div className="relative bg-white dark:bg-gray-800 p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-300/50 dark:group-hover:border-cyan-400/30 z-10">
                {/* Step Number */}
                <motion.div
                  variants={stepNumberVariants}
                  className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-900"
                >
                  <span className="text-white font-bold text-lg">
                    {index + 1}
                  </span>
                </motion.div>

                {/* Icon Container */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                  <span className="material-symbols-outlined text-white text-4xl">
                    {step.icon}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-2xl lg:text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white leading-tight">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center text-lg leading-relaxed">
                  {step.description}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-5 blur-md transition-opacity duration-500 -z-10" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tablet View - 2 columns */}
        <motion.div
          className="hidden md:grid lg:hidden grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/60 dark:border-gray-700/50"
            >
              <motion.div
                variants={stepNumberVariants}
                className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-900"
              >
                <span className="text-white font-bold text-sm">
                  {index + 1}
                </span>
              </motion.div>

              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-3xl">
                  {step.icon}
                </span>
              </div>

              <h3 className="text-xl font-bold text-center mb-3 text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-base leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile View - Enhanced */}
        <motion.div
          className="md:hidden relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Timeline Line */}
          <div className="absolute left-8 top-12 bottom-12 w-1 bg-gradient-to-b from-blue-500/30 via-cyan-400/30 to-blue-500/30 rounded-full shadow-inner"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex items-start mb-16 last:mb-0 group"
              variants={cardVariants}
            >
              {/* Step Number Bubble */}
              <motion.div
                variants={stepNumberVariants}
                className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center z-10 shadow-lg border-4 border-white dark:border-gray-900 group-hover:scale-110 transition-transform duration-300"
              >
                <span className="text-white font-bold text-lg">
                  {index + 1}
                </span>
              </motion.div>

              {/* Content Card */}
              <div className="ml-6 flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-300/30">
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <span className="material-symbols-outlined text-white text-2xl">
                    {step.icon}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connecting Dot */}
              <div className="absolute left-14 top-8 w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-lg z-20"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16 md:mt-20 lg:mt-24"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-8 md:p-12 border border-blue-200/50 dark:border-blue-700/30">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied homeowners who brought their vision to
              life with our platform.
            </p>
            <button
              onClick={() => {
                router.push("/contact");
              }}
              className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Your Project Today
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
