'use client';
import React, { useRef, useState, useEffect } from 'react';
import { designs } from '@/lib/dummydata';
import DesignCard from '@/components/DesignCard';
import { motion, AnimatePresence } from 'framer-motion';

const RecommendedDesigns = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScrollability();
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(el);
      return () => resizeObserver.unobserve(el);
    }
  }, []);

  return (
    <section className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recommended for You</h3>
      <div className="relative">
        <div 
          ref={scrollRef} 
          onScroll={checkScrollability}
          className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
        >
          {designs.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[300px]"
            >
              <DesignCard design={design} />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {canScrollLeft && (
            <motion.button 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => scroll('left')} 
              className="absolute top-1/2 -translate-y-1/2 left-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 rounded-full shadow-lg z-10 hover:bg-white dark:hover:bg-gray-900 transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {canScrollRight && (
            <motion.button 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => scroll('right')} 
              className="absolute top-1/2 -translate-y-1/2 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 rounded-full shadow-lg z-10 hover:bg-white dark:hover:bg-gray-900 transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RecommendedDesigns;
