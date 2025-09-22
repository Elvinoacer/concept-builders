'use client';

import React, { useState } from 'react';
import { testimonials as initialTestimonials } from '@/lib/testimonials';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Add a title to the testimonial data
const testimonials = initialTestimonials.map((t, i) => ({
  ...t,
  title: i % 2 === 0 ? 'Homeowner' : 'Real Estate Developer',
}));

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  const nextTestimonial = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex(index + newDirection);
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">Real stories from satisfied homeowners and builders who chose Concept Builders.</p>
        </div>

        <div className="relative h-80 md:h-72 max-w-3xl mx-auto flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute w-full h-full flex items-center justify-center"
            >
              <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full mx-4">
                <span className="material-symbols-outlined text-5xl text-blue-500 dark:text-blue-400 absolute -top-5 -left-2 opacity-20">
                  format_quote
                </span>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg italic mb-6 text-center">
                  {testimonials[index].testimonial}
                </p>
                <div className="flex items-center justify-center">
                  <div className="relative w-14 h-14 mr-4">
                    <Image
                      src={testimonials[index].image}
                      alt={testimonials[index].name}
                      fill
                      className="rounded-full object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{testimonials[index].name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[index].title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button 
            onClick={prevTestimonial} 
            className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-16 bg-white dark:bg-gray-700/50 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition z-20"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button 
            onClick={nextTestimonial} 
            className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-16 bg-white dark:bg-gray-700/50 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition z-20"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        
        <div className="flex justify-center mt-8">
          {testimonials.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full mx-1.5 transition-colors ${index === i ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
