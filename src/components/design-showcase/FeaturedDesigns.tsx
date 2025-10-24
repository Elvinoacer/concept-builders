'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DesignCard from './DesignCard';

const FeaturedDesigns = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [featuredDesigns, setFeaturedDesigns] = useState([]);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await fetch('/api/designs?limit=5&isFeatured=true');
        const data = await response.json();
        setFeaturedDesigns(data.designs);
      } catch (error) {
        console.error('Error fetching featured designs:', error);
      }
    };

    fetchDesigns();
  }, []);

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
          {featuredDesigns.map((design: any, index) => (
            <div
              key={design.id}
              className="w-[80%] sm:w-[45%] md:w-[30%] lg:w-[23%] flex-shrink-0 snap-start"
            >
              <DesignCard design={design} index={index} showDetails={false} />
            </div>
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