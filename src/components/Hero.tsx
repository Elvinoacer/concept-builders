"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { slides as dummySlides } from "@/lib/dummydata";
import { Banner } from "@/generated/prisma";

interface HeroProps {
  banners: Banner[];
}

const Hero = ({ banners }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();

  const slidesToUse = banners.length > 0 ? banners : dummySlides;

  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slidesToUse.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [slidesToUse.length, isHovering]);

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/design-showcase?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slidesToUse.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slidesToUse.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="@container">
        <div className="@[480px]:p-2 md:@[480px]:p-4">
          <div
            className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-2xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-cyan-50/20 dark:from-blue-950/10 dark:to-cyan-950/10 z-0" />

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slidesToUse[currentSlide].image}
                  alt={slidesToUse[currentSlide].title}
                  fill
                  className="object-cover bg-center"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  quality={90}
                />
                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-4 flex items-center z-20">
              <button
                onClick={prevSlide}
                className="p-3 rounded-2xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 text-white hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
              >
                <span className="material-symbols-outlined text-2xl group-hover:-translate-x-0.5 transition-transform">
                  chevron_left
                </span>
              </button>
            </div>

            <div className="absolute inset-y-0 right-4 flex items-center z-20">
              <button
                onClick={nextSlide}
                className="p-3 rounded-2xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 text-white hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
              >
                <span className="material-symbols-outlined text-2xl group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </button>
            </div>

            {/* Content Container */}
            <div className="relative flex min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex-col items-start justify-end gap-6 px-6 md:px-12 lg:px-16 pb-8 md:pb-12 lg:pb-16 z-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex flex-col gap-4 md:gap-6 text-left max-w-2xl lg:max-w-3xl"
              >
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight [text-shadow:2px_2px_8px_rgba(0,0,0,0.7)]">
                  {slidesToUse[currentSlide].title}
                </h1>
                <motion.p
                  className="text-gray-200 text-lg sm:text-xl md:text-2xl leading-relaxed [text-shadow:2px_2px_6px_rgba(0,0,0,0.6)] max-w-3xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  {slidesToUse[currentSlide].description}
                </motion.p>
              </motion.div>

              {/* Enhanced Search Form */}
              <motion.form
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="relative w-full max-w-2xl"
                onSubmit={handleSearch}
              >
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10">
                    search
                  </span>
                  <input
                    className="w-full h-14 md:h-16 resize-none overflow-hidden rounded-2xl border-2 border-white/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md pl-14 pr-32 md:pr-36 text-lg md:text-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 shadow-2xl"
                    placeholder="Search for house plans, designs, or styles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 md:h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-6 md:px-8 text-sm md:text-base font-bold text-white shadow-lg hover:from-blue-700 hover:to-cyan-500 hover:shadow-xl hover:scale-105 transition-all duration-300 group/btn"
                  >
                    Search
                    <span className="material-symbols-outlined ml-2 text-lg group-hover/btn:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </motion.form>
            </div>

            {/* Enhanced Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
              {slidesToUse.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`group relative transition-all duration-300 ${
                    currentSlide === index ? "scale-125" : "scale-100"
                  }`}
                >
                  <div
                    className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                  >
                    <span className="sr-only">Go to slide {index + 1}</span>
                  </div>
                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {slidesToUse[index].title}
                  </div>
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
              <motion.div
                key={currentSlide}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-8 right-8 hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20">
                <div className="text-white text-sm font-semibold">
                  <span className="text-blue-300">{currentSlide + 1}</span>
                  <span className="text-white/60"> / {slidesToUse.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
