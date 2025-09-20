import React from 'react';
import { designs } from '@/lib/designs';
import Image from 'next/image';

const BestSellingPlans = () => {
  const bestSellingDesigns = designs.slice(0, 3);

  return (
    <section className="py-8 md:py-12 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 dark:text-white">Best Selling Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellingDesigns.map((design) => (
            <div key={design.id} className="border rounded-lg overflow-hidden shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <Image src={design.image} alt={design.name} width={400} height={250} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{design.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{design.category}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">${design.pricing.pdf}</p>
                  <button className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-500 transition-all">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellingPlans;
