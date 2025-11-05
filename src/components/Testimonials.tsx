"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Feedback } from "@/generated/prisma";

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [featuredFeedback, setFeaturedFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchFeaturedFeedback = async () => {
      try {
        const response = await fetch("/api/featured-feedback");
        const data = await response.json();
        setFeaturedFeedback(data);
      } catch (error) {
        console.error("Error fetching featured feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedFeedback();
  }, []);

  const nextTestimonial = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % featuredFeedback.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setIndex(
      (prev) => (prev - 1 + featuredFeedback.length) % featuredFeedback.length
    );
  };

  const goToSlide = (slideIndex: number) => {
    setDirection(slideIndex > index ? 1 : -1);
    setIndex(slideIndex);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const starVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: (i: number) => ({
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 200,
      },
    }),
  };

  if (loading) {
    return (
      <section className="relative py-16 md:py-24 lg:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-96 mx-auto mb-12"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredFeedback.length) {
    return null;
  }

  const currentFeedback = featuredFeedback[index];

  return (
    <section className="relative py-16 md:py-24 lg:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 -left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 -right-10 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-4">
            Client Success Stories
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover why homeowners and builders trust Concept Builders for
            their dream projects
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-96 md:h-80 flex items-center justify-center overflow-hidden rounded-3xl">
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
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="absolute w-full h-full flex items-center justify-center px-4"
              >
                <div className="relative bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl lg:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-200/60 dark:border-gray-700/50 w-full max-w-2xl">
                  {/* Quote Icon */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-2xl">
                      format_quote
                    </span>
                  </div>

                  {/* Stars Rating */}
                  <div className="flex justify-center mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.span
                        key={star}
                        custom={star}
                        initial="hidden"
                        animate="visible"
                        className="material-symbols-outlined text-amber-500 text-2xl md:text-3xl mx-1"
                      >
                        star
                      </motion.span>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed text-center mb-8 italic font-light"
                  >
                    "{currentFeedback.feedback}"
                  </motion.p>

                  {/* Client Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-4"
                  >
                    <div className="relative w-20 h-20">
                      <Image
                        src={
                          currentFeedback.user?.image ||
                          "/images/default-avatar.png"
                        }
                        alt={currentFeedback.user?.name || "Anonymous"}
                        fill
                        className="rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                        sizes="80px"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                      />
                      {/* Online Indicator */}
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div>
                      <p className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                        {currentFeedback.user?.name || "Anonymous"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                        {currentFeedback.category}
                      </p>
                      <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500 dark:text-gray-400">
                        <span className="material-symbols-outlined text-base mr-1">
                          schedule
                        </span>
                        Verified Client
                      </div>
                    </div>
                  </motion.div>

                  {/* Background Pattern */}
                  <div className="absolute bottom-4 right-4 opacity-5">
                    <span className="material-symbols-outlined text-6xl">
                      architecture
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-2 md:-left-20 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200/50 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 z-20 group"
            >
              <span className="material-symbols-outlined text-2xl text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                chevron_left
              </span>
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-2 md:-right-20 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200/50 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 z-20 group"
            >
              <span className="material-symbols-outlined text-2xl text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                chevron_right
              </span>
            </button>
          </div>

          {/* Enhanced Pagination Dots */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
              {featuredFeedback.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`relative transition-all duration-300 ${
                    index === i ? "scale-125" : "scale-100 hover:scale-110"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === i
                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                  />

                  {/* Active dot glow */}
                  {index === i && (
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-blue-400/40 animate-ping"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Testimonial Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                <span className="text-blue-600 dark:text-cyan-400">
                  {index + 1}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {" "}
                  / {featuredFeedback.length}
                </span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-8 md:p-12 border border-blue-200/50 dark:border-blue-700/30">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Share Your Story?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Join our growing community of satisfied clients and share your
              Concept Builders experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/cta">
                Share Your Feedback
                <span className="material-symbols-outlined ml-3 text-xl group-hover/cta:translate-x-1 transition-transform duration-300">
                  rate_review
                </span>
              </button>
              <button className="inline-flex items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 text-lg font-semibold rounded-2xl border border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/cta2">
                View All Stories
                <span className="material-symbols-outlined ml-3 text-xl group-hover/cta2:translate-x-1 transition-transform duration-300">
                  menu_book
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
