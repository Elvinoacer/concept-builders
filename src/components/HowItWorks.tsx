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
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    offscreen: {
      y: 40,
      opacity: 0,
      scale: 0.98,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.2,
        duration: 0.6,
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
        delay: 0.15,
      },
    },
  };

  return (
    <section className="relative py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Elements - Responsive scaling */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-4 xs:-left-6 sm:-left-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full blur-2xl xs:blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-4 xs:-right-6 sm:-right-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl xs:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-full blur-2xl xs:blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24"
        >
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-3 xs:mb-4">
            How It Works
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed sm:leading-normal">
            Follow our simple process to bring your dream home to life with ease
            and confidence
          </p>
        </motion.div>

        {/* Desktop View - Enhanced */}
        <motion.div
          className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8 md:gap-10 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
              className="group relative"
            >
              {/* Connecting Lines */}
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 -right-5 xs:-right-6 w-10 xs:w-12 h-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 z-0 group-hover:from-blue-500/50 group-hover:to-cyan-400/50 transition-all duration-300" />
              )}

              <div className="relative bg-white dark:bg-gray-800 p-6 xs:p-7 sm:p-8 lg:p-9 xl:p-10 rounded-xl xs:rounded-2xl lg:rounded-3xl shadow-lg xs:shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-300/50 dark:group-hover:border-cyan-400/30 z-10">
                {/* Step Number */}
                <motion.div
                  variants={stepNumberVariants}
                  className="absolute -top-3 xs:-top-4 -left-3 xs:-left-4 w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-900"
                >
                  <span className="text-white font-bold text-sm xs:text-base">
                    {index + 1}
                  </span>
                </motion.div>

                {/* Icon Container */}
                <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 xs:mb-5 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
                  <span className="material-symbols-outlined text-white text-2xl xs:text-3xl sm:text-4xl">
                    {step.icon}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-center mb-3 xs:mb-4 text-gray-900 dark:text-white leading-tight line-clamp-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center text-sm xs:text-base sm:text-lg leading-relaxed line-clamp-3">
                  {step.description}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl xs:rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-5 blur-md transition-opacity duration-500 -z-10" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tablet View - 2 columns */}
        <motion.div
          className="hidden md:grid lg:hidden grid-cols-1 md:grid-cols-2 gap-5 xs:gap-6 sm:gap-7 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative bg-white dark:bg-gray-800 p-5 xs:p-6 sm:p-7 md:p-8 rounded-xl xs:rounded-2xl shadow-lg xs:shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/60 dark:border-gray-700/50"
            >
              <motion.div
                variants={stepNumberVariants}
                className="absolute -top-2 xs:-top-3 -left-2 xs:-left-3 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg xs:rounded-xl flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-900"
              >
                <span className="text-white font-bold text-xs xs:text-sm">
                  {index + 1}
                </span>
              </motion.div>

              <div className="w-14 h-14 xs:w-15 xs:h-15 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg xs:rounded-xl flex items-center justify-center mx-auto mb-3 xs:mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-xl xs:text-2xl sm:text-3xl">
                  {step.icon}
                </span>
              </div>

              <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-center mb-2 xs:mb-3 text-gray-900 dark:text-white line-clamp-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-xs xs:text-sm sm:text-base leading-relaxed line-clamp-3">
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
          <div className="absolute left-6 xs:left-7 sm:left-8 top-10 xs:top-12 bottom-10 xs:bottom-12 w-0.5 xs:w-1 bg-gradient-to-b from-blue-500/30 via-cyan-400/30 to-blue-500/30 rounded-full shadow-inner"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex items-start mb-12 xs:mb-14 sm:mb-16 last:mb-0 group"
              variants={cardVariants}
            >
              {/* Step Number Bubble */}
              <motion.div
                variants={stepNumberVariants}
                className="flex-shrink-0 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center z-10 shadow-lg border-3 xs:border-4 border-white dark:border-gray-900 group-hover:scale-105 transition-transform duration-300"
              >
                <span className="text-white font-bold text-sm xs:text-base">
                  {index + 1}
                </span>
              </motion.div>

              {/* Content Card */}
              <div className="ml-4 xs:ml-5 sm:ml-6 flex-1 bg-white dark:bg-gray-800 p-4 xs:p-5 sm:p-6 rounded-xl xs:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-300/30">
                {/* Icon */}
                <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg xs:rounded-xl flex items-center justify-center mb-3 xs:mb-4 shadow-md">
                  <span className="material-symbols-outlined text-white text-lg xs:text-xl sm:text-2xl">
                    {step.icon}
                  </span>
                </div>

                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold mb-2 xs:mb-3 text-gray-900 dark:text-white leading-tight line-clamp-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs xs:text-sm sm:text-base leading-relaxed line-clamp-3">
                  {step.description}
                </p>
              </div>

              {/* Connecting Dot */}
              <div className="absolute left-10 xs:left-12 sm:left-14 top-6 xs:top-7 sm:top-8 w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-lg z-20"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-10 xs:mt-12 sm:mt-14 md:mt-16 lg:mt-20 xl:mt-24"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl xs:rounded-2xl p-5 xs:p-6 sm:p-7 md:p-8 lg:p-10 xl:p-12 border border-blue-200/50 dark:border-blue-700/30">
            <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base sm:text-lg mb-4 xs:mb-5 sm:mb-6 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed">
              Join thousands of satisfied homeowners who brought their vision to
              life with our platform.
            </p>
            <button
              onClick={() => {
                router.push("/contact");
              }}
              className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold rounded-lg xs:rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 w-full xs:w-auto"
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
