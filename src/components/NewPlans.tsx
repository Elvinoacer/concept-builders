import React from "react";
import { designs } from "@/lib/designs";
import Image from "next/image";
import Link from "next/link";

const NewPlans = () => {
  // Show the last 2 designs as "new"
  const newDesigns = designs.slice(1, 3);

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Explore Our Newest Plans</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">Fresh designs hot off the press, featuring the latest architectural trends and innovations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {newDesigns.map((design) => (
            <div
              key={design.id}
              className="group relative border rounded-xl overflow-hidden shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={design.image}
                  alt={design.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200">
                  {design.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                  {design.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mb-4">
                  <span>{design.details.bedrooms} Beds</span>
                  <span>{design.details.bathrooms} Baths</span>
                  <span>{design.details.area} sqft</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                    ${design.pricing.pdf}
                  </p>
                  <Link href={`/designs/${design.id}`} className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold px-5 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
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

export default NewPlans;
