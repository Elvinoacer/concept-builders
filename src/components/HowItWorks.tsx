import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 dark:text-white">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                1
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 dark:text-gray-200">
              Choose a Plan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Browse our collection of house plans and find the one that&apos;s
              right for you.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                2
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 dark:text-gray-200">
              Purchase & Download
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Securely purchase your plan and instantly download the digital
              files.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                3
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 dark:text-gray-200">
              Build Your Home
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Work with your builder to bring your dream home to life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
