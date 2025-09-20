import React from 'react';

const HowItWorks = () => {
  return (
    <section className="py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 dark:text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">1. Choose a Plan</h3>
            <p className="dark:text-gray-400">Browse our collection of house plans and find the one that's right for you.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">2. Purchase & Download</h3>
            <p className="dark:text-gray-400">Securely purchase your plan and instantly download the digital files.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">3. Build Your Home</h3>
            <p className="dark:text-gray-400">Work with your builder to bring your dream home to life.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
