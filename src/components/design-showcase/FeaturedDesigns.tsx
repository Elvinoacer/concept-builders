
'use client';

import { useRef } from 'react';
import { designs as featuredDesigns } from "@/lib/dummydata";
import { motion } from 'framer-motion';
import Image from 'next/image';

const FeaturedDesigns = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-8 md:mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-6">Featured Designs</h2>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory overflow-x-auto pb-6 -mx-4 px-4 gap-6 scrollbar-hide touch-pan-x"
        >
          {featuredDesigns.map((design, index) => (
            <motion.div
              key={index}
              className="group w-[80%] sm:w-[45%] md:w-[30%] lg:w-[23%] flex-shrink-0 snap-start"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  alt={design.name}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={design.image}
                  width={320}
                  height={192}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h3 className="font-bold text-white">{design.name}</h3>
                  <p className="text-sm text-gray-200 dark:text-gray-300">{design.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0">
          <button
            onClick={() => scroll(-300)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-primary/20 dark:hover:bg-primary/30 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
        </div>
        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-0">
          <button
            onClick={() => scroll(300)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-primary/20 dark:hover:bg-primary/30 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDesigns;
