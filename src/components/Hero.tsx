"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    title: "Build Your Dream Home",
    description:
      "Explore our curated collection of house plans and start your journey to homeownership today.",
    image: "/images/banner-1.png",
  },
  {
    title: "Luxurious and Affordable Designs",
    description:
      "Find the perfect balance of luxury and affordability with our wide range of house plans.",
    image: "/images/banner-2.png",
  },
  {
    title: "Customizable Plans to Fit Your Needs",
    description:
      "Our team of experts can help you customize any of our plans to create your perfect home.",
    image: "/images/banner-3.png",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="@container">
        <div className="@[480px]:p-4">
          <div className="relative min-h-[520px] rounded-2xl overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  layout="fill"
                  objectFit="cover"
                  className="bg-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>
            </AnimatePresence>
            <div className="relative flex min-h-[520px] flex-col items-start justify-end gap-8 px-6 md:px-12 pb-8 md:pb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4 text-left max-w-2xl"
              >
                <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight tracking-tight @[480px]:text-6xl [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-gray-200 text-base md:text-lg @[480px]:text-xl [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative w-full max-w-xl"
              >
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  search
                </span>
                <input
                  className="form-input flex w-full h-14 md:h-16 resize-none overflow-hidden rounded-md border border-gray-300 bg-white pl-12 pr-28 md:pr-32 text-base md:text-lg text-slate-800 placeholder:text-gray-400 focus:border-[#1193d4] focus:ring-[#1193d4] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
                  placeholder="Search house plans, styles, or features"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 md:h-12 items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-cyan-400 px-4 md:px-6 text-sm md:text-base font-bold text-white shadow-sm hover:from-blue-700 hover:to-cyan-500 transition-all">
                  Search
                </button>
              </motion.div>
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 w-3 rounded-full ${
                    currentSlide === index ? "bg-blue-600" : "bg-cyan-400"
                  }`}
                >
                  <span className="sr-only">Go to slide {index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
