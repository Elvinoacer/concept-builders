
'use client';

import { useRef } from 'react';
import { featuredDesigns } from '@/lib/design-showcase-data';
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
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Featured Designs</h2>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory overflow-x-auto pb-6 -mx-4 px-4 gap-6 scrollbar-hide"
        >
          {featuredDesigns.map((design, index) => (
            <motion.div
              key={index}
              className="group w-80 min-w-[80%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[23%] snap-start flex-shrink-0"
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
        <div className="absolute top-1/2 -translate-y-1/2 left-0">
          <button
            onClick={() => scroll(-300)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-primary/20 dark:hover:bg-primary/30 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-0">
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
