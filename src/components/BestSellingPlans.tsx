import React from "react";
import { designs } from "@/lib/designs";
import Image from "next/image";
import Link from "next/link";

const BestSellingPlans = () => {
  const bestSellingDesigns = designs.slice(0, 3);

  return (
    <section className="py-8 md:py-12 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 dark:text-white">
          Best Selling Plans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {bestSellingDesigns.map((design) => (
            <div
              key={design.id}
              className="border rounded-lg overflow-hidden shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-transform hover:scale-[1.02]"
            >
              <div className="relative h-48 sm:h-56 md:h-64 w-full">
                <Image
                  src={design.image}
                  alt={design.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2 dark:text-white line-clamp-1">
                  {design.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  {design.category}
                </p>
                <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
                  <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                    ${design.pricing.pdf}
                  </p>
                  <Link href={`/designs/${design.id}`} className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg hover:from-blue-700 hover:to-cyan-500 transition-all">
                    View Details
                  </Link>
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
