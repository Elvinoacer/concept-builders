"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { slides as dummySlides } from "@/lib/dummydata";
import { Banner } from "@/generated/prisma/browser";

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
        <div className="@[320px]:p-1 @[375px]:p-2 @[480px]:p-3 sm:p-4">
          <div
            className="relative min-h-[400px] xs:min-h-[450px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[600px] xl:min-h-[700px] rounded-xl @[375px]:rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-lg @[375px]:shadow-xl md:shadow-2xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-cyan-50/20 dark:from-blue-950/10 dark:to-cyan-950/10 z-0" />

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slidesToUse[currentSlide].image}
                  alt={slidesToUse[currentSlide].title}
                  fill
                  className="object-cover bg-center"
                  priority
                  sizes="(max-width: 320px) 100vw, (max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  quality={85}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                />
                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows - Responsive positioning and sizing */}
            <div className="absolute inset-y-0 left-2 @[375px]:left-3 sm:left-4 flex items-center z-20">
              <button
                onClick={prevSlide}
                className="p-2 @[375px]:p-2.5 sm:p-3 rounded-xl @[375px]:rounded-2xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 text-white hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 hover:scale-105 sm:hover:scale-110 hover:shadow-lg group touch-manipulation"
              >
                <span className="material-symbols-outlined text-lg @[375px]:text-xl sm:text-2xl group-hover:-translate-x-0.5 transition-transform">
                  chevron_left
                </span>
              </button>
            </div>

            <div className="absolute inset-y-0 right-2 @[375px]:right-3 sm:right-4 flex items-center z-20">
              <button
                onClick={nextSlide}
                className="p-2 @[375px]:p-2.5 sm:p-3 rounded-xl @[375px]:rounded-2xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 text-white hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 hover:scale-105 sm:hover:scale-110 hover:shadow-lg group touch-manipulation"
              >
                <span className="material-symbols-outlined text-lg @[375px]:text-xl sm:text-2xl group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </button>
            </div>

            {/* Content Container */}
            <div className="relative flex min-h-[400px] xs:min-h-[450px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[600px] xl:min-h-[700px] flex-col items-start justify-end gap-4 @[375px]:gap-5 sm:gap-6 px-4 @[375px]:px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 pb-6 @[375px]:pb-7 sm:pb-8 md:pb-10 lg:pb-12 xl:pb-16 z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col gap-3 @[375px]:gap-4 sm:gap-5 md:gap-6 text-left max-w-full @[480px]:max-w-xl sm:max-w-2xl lg:max-w-3xl"
              >
                <h1 className="text-white text-2xl @[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight [text-shadow:1px_1px_4px_rgba(0,0,0,0.7)] sm:[text-shadow:2px_2px_8px_rgba(0,0,0,0.7)] line-clamp-2 @[375px]:line-clamp-3">
                  {slidesToUse[currentSlide].title}
                </h1>
                <motion.p
                  className="text-gray-200 text-base @[375px]:text-lg sm:text-xl md:text-2xl leading-relaxed [text-shadow:1px_1px_3px_rgba(0,0,0,0.6)] sm:[text-shadow:2px_2px_6px_rgba(0,0,0,0.6)] max-w-full line-clamp-2 @[375px]:line-clamp-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {slidesToUse[currentSlide].description}
                </motion.p>
              </motion.div>

              {/* Enhanced Search Form - Fully Responsive */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative w-full max-w-full @[480px]:max-w-xl sm:max-w-2xl"
                onSubmit={handleSearch}
              >
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 @[375px]:left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 text-base @[375px]:text-lg sm:text-xl z-10">
                    search
                  </span>
                  <input
                    className="w-full h-12 @[375px]:h-14 sm:h-16 resize-none overflow-hidden rounded-lg @[375px]:rounded-xl sm:rounded-2xl border-2 border-white/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md pl-10 @[375px]:pl-12 sm:pl-14 pr-24 @[375px]:pr-28 sm:pr-32 md:pr-36 text-sm @[375px]:text-base sm:text-lg md:text-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-400 focus:ring-2 sm:focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 shadow-lg @[375px]:shadow-xl touch-manipulation"
                    placeholder="Search house plans, designs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-1 @[375px]:right-2 top-1/2 -translate-y-1/2 flex h-8 @[375px]:h-9 sm:h-10 md:h-12 items-center justify-center rounded-lg @[375px]:rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-3 @[375px]:px-4 sm:px-5 md:px-6 text-xs @[375px]:text-sm sm:text-base font-bold text-white shadow-md @[375px]:shadow-lg hover:from-blue-700 hover:to-cyan-500 hover:shadow-xl hover:scale-105 transition-all duration-300 group/btn touch-manipulation"
                  >
                    <span className="hidden @[375px]:inline">Search</span>
                    <span className="@[375px]:hidden">Go</span>
                    <span className="material-symbols-outlined ml-1 @[375px]:ml-2 text-base group-hover/btn:translate-x-0.5 transition-transform hidden @[375px]:block">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </motion.form>
            </div>

            {/* Enhanced Slide Indicators - Responsive sizing */}
            <div className="absolute bottom-4 @[375px]:bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 @[375px]:gap-2.5 sm:gap-3 z-20">
              {slidesToUse.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`group relative transition-all duration-300 touch-manipulation ${
                    currentSlide === index
                      ? "scale-110 sm:scale-125"
                      : "scale-100"
                  }`}
                >
                  <div
                    className={`h-2 w-2 @[375px]:h-2.5 @[375px]:w-2.5 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md sm:shadow-lg"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                  >
                    <span className="sr-only">Go to slide {index + 1}</span>
                  </div>
                  {/* Hover Tooltip - Hidden on touch devices */}
                  <div className="absolute bottom-full mb-1 @[375px]:mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden @[480px]:block">
                    {slidesToUse[index].title}
                  </div>
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 @[375px]:h-1 bg-white/20 z-20">
              <motion.div
                key={currentSlide}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              />
            </div>

            {/* Decorative Elements - Responsive visibility */}
            <div className="absolute top-4 @[375px]:top-5 sm:top-6 right-4 @[375px]:right-5 sm:right-6 lg:right-8">
              <div className="bg-white/10 backdrop-blur-md rounded-lg @[375px]:rounded-xl sm:rounded-2xl px-2 @[375px]:px-3 sm:px-4 py-1.5 @[375px]:py-2 sm:py-3 border border-white/20 hidden sm:block">
                <div className="text-white text-xs @[375px]:text-sm font-semibold">
                  <span className="text-blue-300">{currentSlide + 1}</span>
                  <span className="text-white/60"> / {slidesToUse.length}</span>
                </div>
              </div>
            </div>

            {/* Mobile Slide Counter - Only shown on small screens */}
            <div className="absolute top-4 right-4 sm:hidden">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
                <div className="text-white text-xs font-medium">
                  <span className="text-blue-300">{currentSlide + 1}</span>
                  <span className="text-white/60">/{slidesToUse.length}</span>
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
