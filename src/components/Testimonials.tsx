"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Feedback } from "@/generated/prisma/browser";

interface TestimonialsProps {
  testimonials: Feedback[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const [index, setIndex] = useState(0);
  const [featuredFeedback, setFeaturedFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchFeaturedFeedback = async () => {
      try {
        // Use the passed testimonials prop if available, otherwise fetch
        if (testimonials && testimonials.length > 0) {
          setFeaturedFeedback(testimonials);
        } else {
          const response = await fetch("/api/featured-feedback");
          const data = await response.json();
          setFeaturedFeedback(data);
        }
      } catch (error) {
        console.error("Error fetching featured feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedFeedback();
  }, [testimonials]);

  const nextTestimonial = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % featuredFeedback.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setIndex(
      (prev) => (prev - 1 + featuredFeedback.length) % featuredFeedback.length,
    );
  };

  const goToSlide = (slideIndex: number) => {
    setDirection(slideIndex > index ? 1 : -1);
    setIndex(slideIndex);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const starVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: (i: number) => ({
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.08,
        type: "spring",
        stiffness: 200,
      },
    }),
  };

  if (loading) {
    return (
      <div className="relative py-8 xs:py-10 sm:py-12 md:py-14 lg:py-16 bg-gradient-to-b from-surface to-ink rounded-2xl sm:rounded-3xl border border-cb-border shadow-md sm:shadow-lg">
        <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-6 xs:h-7 sm:h-8 bg-cb-muted rounded-lg w-48 xs:w-56 sm:w-64 mx-auto mb-3 xs:mb-4"></div>
              <div className="h-3 xs:h-4 bg-cb-border rounded w-64 xs:w-72 sm:w-80 mx-auto mb-8 xs:mb-10 sm:mb-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredFeedback.length) {
    return null;
  }

  const currentFeedback = featuredFeedback[index];

  return (
    <div className="relative bg-gradient-to-br from-surface to-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 border border-cb-border shadow-md sm:shadow-lg overflow-hidden">
      {/* Background Elements - Responsive scaling */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-6 xs:top-8 sm:top-10 -left-4 xs:-left-6 sm:-left-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-r from-gold/10 to-gold-light/10 rounded-full blur-2xl xs:blur-3xl"></div>
        <div className="absolute bottom-6 xs:bottom-8 sm:bottom-10 -right-4 xs:-right-6 sm:-right-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-r from-gold-light/10 to-gold/10 rounded-full blur-2xl xs:blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Testimonial Carousel */}
        <div className="relative max-w-full lg:max-w-4xl mx-auto">
          <div className="relative h-80 xs:h-84 sm:h-88 md:h-96 lg:h-80 flex items-center justify-center overflow-hidden rounded-xl xs:rounded-2xl lg:rounded-3xl">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                className="absolute w-full h-full flex items-center justify-center px-3 xs:px-4 sm:px-5"
              >
                <div className="relative bg-card p-5 xs:p-6 sm:p-7 md:p-8 lg:p-10 xl:p-12 rounded-xl xs:rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-cb-border w-full max-w-full lg:max-w-2xl">
                  {/* Quote Icon - Responsive sizing */}
                  <div className="absolute -top-3 xs:-top-4 -left-3 xs:-left-4 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-gold to-gold-light rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-ink text-lg xs:text-xl sm:text-2xl">
                      format_quote
                    </span>
                  </div>

                  {/* Stars Rating - Responsive sizing */}
                  <div className="flex justify-center mb-4 xs:mb-5 sm:mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.span
                        key={star}
                        custom={star}
                        initial="hidden"
                        animate="visible"
                        variants={starVariants}
                        className="material-symbols-outlined text-amber-500 text-xl xs:text-2xl sm:text-3xl mx-0.5 xs:mx-1"
                      >
                        star
                      </motion.span>
                    ))}
                  </div>

                  {/* Testimonial Text - Responsive sizing */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-cream-dim text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed text-center mb-6 xs:mb-7 sm:mb-8 italic font-light line-clamp-4 xs:line-clamp-5 sm:line-clamp-6"
                  >
                    "{currentFeedback.feedback}"
                  </motion.p>

                  {/* Client Info - Responsive layout */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col xs:flex-row items-center justify-center text-center xs:text-left gap-3 xs:gap-4"
                  >
                    <div className="relative w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20">
                      <Image
                        src={
                          currentFeedback.user?.image ||
                          "/images/default-avatar.png"
                        }
                        alt={currentFeedback.user?.name || "Anonymous"}
                        fill
                        className="rounded-lg xs:rounded-xl object-cover border-3 xs:border-4 border-ink shadow-lg"
                        sizes="(max-width: 320px) 64px, (max-width: 480px) 72px, 80px"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                      />
                      {/* Online Indicator */}
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 xs:w-3 xs:h-3 bg-green-500 rounded-full border-1.5 xs:border-2 border-ink"></div>
                    </div>
                    <div>
                      <p className="font-bold text-lg xs:text-xl sm:text-2xl text-cream mb-0.5 xs:mb-1 line-clamp-1">
                        {currentFeedback.user?.name || "Anonymous"}
                      </p>
                      <p className="text-cream-dim text-sm xs:text-base sm:text-lg mb-1 xs:mb-2 line-clamp-1">
                        {currentFeedback.category}
                      </p>
                      <div className="flex items-center justify-center xs:justify-start text-xs xs:text-sm text-cb-muted">
                        <span className="material-symbols-outlined text-xs xs:text-sm mr-1">
                          schedule
                        </span>
                        Verified Client
                      </div>
                    </div>
                  </motion.div>

                  {/* Background Pattern */}
                  <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 right-2 xs:right-3 sm:right-4 opacity-5">
                    <span className="material-symbols-outlined text-3xl xs:text-4xl sm:text-5xl lg:text-6xl">
                      architecture
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows - Responsive positioning and sizing */}
            <button
              onClick={prevTestimonial}
              className="absolute left-1 xs:left-2 sm:left-3 md:-left-16 lg:-left-20 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-md p-2 xs:p-2.5 sm:p-3 md:p-4 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-cb-border hover:bg-surface transition-all duration-300 hover:scale-105 sm:hover:scale-110 z-20 group touch-manipulation"
            >
              <span className="material-symbols-outlined text-lg xs:text-xl sm:text-2xl text-cream-dim group-hover:text-gold">
                chevron_left
              </span>
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-1 xs:right-2 sm:right-3 md:-right-16 lg:-right-20 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-md p-2 xs:p-2.5 sm:p-3 md:p-4 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-cb-border hover:bg-surface transition-all duration-300 hover:scale-105 sm:hover:scale-110 z-20 group touch-manipulation"
            >
              <span className="material-symbols-outlined text-lg xs:text-xl sm:text-2xl text-cream-dim group-hover:text-gold">
                chevron_right
              </span>
            </button>
          </div>

          {/* Enhanced Pagination Dots - Responsive sizing */}
          <div className="flex justify-center mt-8 xs:mt-10 sm:mt-12">
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 bg-card/80 backdrop-blur-md rounded-lg xs:rounded-xl sm:rounded-2xl px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-2.5 sm:py-3 md:py-4 shadow-lg border border-cb-border">
              {featuredFeedback.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`relative transition-all duration-300 touch-manipulation ${
                    index === i
                      ? "scale-110 xs:scale-125"
                      : "scale-100 hover:scale-105 xs:hover:scale-110"
                  }`}
                >
                  <div
                    className={`w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      index === i
                        ? "bg-gradient-to-r from-gold to-gold-light shadow-md xs:shadow-lg"
                        : "bg-cb-muted hover:bg-cream-dim"
                    }`}
                  />

                  {/* Active dot glow */}
                  {index === i && (
                    <div className="absolute inset-0 w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-400/40 animate-ping"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Testimonial Counter - Responsive sizing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6 xs:mt-7 sm:mt-8"
          >
            <div className="inline-flex items-center bg-card/80 backdrop-blur-md rounded-lg xs:rounded-xl sm:rounded-2xl px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-2.5 sm:py-3 shadow-lg border border-cb-border">
              <span className="text-cream-dim font-semibold text-sm xs:text-base">
                <span className="text-gold">{featuredFeedback.length}+</span>{" "}
                Happy Clients
              </span>
            </div>
          </motion.div>
        </div>

        {/* CTA Section - Responsive layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-10 xs:mt-12 sm:mt-14 md:mt-16 lg:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl xs:rounded-2xl p-5 xs:p-6 sm:p-7 md:p-8 lg:p-10 xl:p-12 border border-blue-200/50 dark:border-blue-700/30">
            <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4">
              Ready to Share Your Story?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base sm:text-lg mb-4 xs:mb-5 sm:mb-6 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed">
              Join our growing community of satisfied clients and share your
              Concept Builders experience.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center">
              <button className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold rounded-lg xs:rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 group/cta w-full xs:w-auto">
                Share Your Feedback
                <span className="material-symbols-outlined ml-2 xs:ml-3 text-lg xs:text-xl group-hover/cta:translate-x-0.5 xs:group-hover/cta:translate-x-1 transition-transform duration-300">
                  rate_review
                </span>
              </button>
              <button className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold rounded-lg xs:rounded-xl sm:rounded-2xl border border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 group/cta2 w-full xs:w-auto">
                View All Stories
                <span className="material-symbols-outlined ml-2 xs:ml-3 text-lg xs:text-xl group-hover/cta2:translate-x-0.5 xs:group-hover/cta2:translate-x-1 transition-transform duration-300">
                  menu_book
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
