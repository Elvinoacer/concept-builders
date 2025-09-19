"use client";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export function RelatedDesigns({ relatedDesigns }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  return (
    <section className="relative mt-24 py-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-r from-purple-400/5 to-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-16 text-center tracking-tight"
      >
        <span className="relative inline-block">
          <span className="relative z-10">You May Also Like</span>
          <motion.span
            className="absolute bottom-0 left-0 w-full h-3 bg-blue-400/30 -rotate-2 -z-10"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </span>
      </motion.h2>

      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 [perspective:1000px] relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          {relatedDesigns.map((design, index) => (
            <DesignCard
              key={index}
              design={design}
              index={index}
              isHovered={isHovered}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation arrows for larger collections */}
      <div className="flex justify-center mt-12 gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </motion.button>
      </div>
    </section>
  );
}

function DesignCard({ design, index, isHovered, activeIndex, setActiveIndex }) {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSelected, setIsSelected] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-200, 200], [10, -10]);
  const rotateY = useTransform(x, [-200, 200], [-10, 10]);

  function handleMouseMove(event) {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setMousePosition({ x: mouseX, y: mouseY });
    const xValue = (mouseX - rect.width / 2) / 20;
    const yValue = (mouseY - rect.height / 2) / 20;

    x.set(xValue);
    y.set(yValue);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsSelected(false);
    if (activeIndex === index) setActiveIndex(null);
  }

  function handleMouseEnter() {
    setActiveIndex(index);
  }

  function handleClick() {
    setIsSelected(!isSelected);
  }

  // Calculate scale based on whether this card is active or others are active
  const getScale = () => {
    if (activeIndex === null) return 1;
    if (activeIndex === index) return 1.05;
    return 0.95;
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotate: (index - 1.5) * 5 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: getScale(),
        z: activeIndex === index ? 50 : 0,
      }}
      exit={{ opacity: 0, y: -50 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.05,
        z: 100,
        transition: { duration: 0.2 },
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className="showcase-item group relative cursor-pointer"
    >
      {/* Glow effect based on mouse position */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />

      <div className="relative h-full">
        {/* Main image with parallax effect */}
        <motion.div
          className="w-full h-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundImage: `url("${design.image}")`,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Shine effect on image */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              left: isHovered ? "100%" : "-100%",
            }}
            transition={{
              opacity: { duration: 0.3 },
              left: { duration: 0.8, ease: "easeInOut" },
            }}
          />
        </motion.div>

        {/* Floating info panel */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6"
          initial={false}
          animate={{
            y: isHovered || isSelected ? 0 : 100,
            opacity: isHovered || isSelected ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-gradient-to-t from-black/90 via-black/80 to-transparent backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <h3 className="text-xl font-bold text-white">{design.name}</h3>
            <p className="text-sm text-gray-200 mt-1 line-clamp-2">{design.description}</p>

            <div className="flex items-center justify-between mt-4">
              <motion.p
                className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                {design.price}
              </motion.p>

              <motion.button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick stats that appear on hover */}
        <motion.div
          className="absolute top-4 left-4 flex flex-col gap-2"
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.3 }}
        >
          {design.bedrooms && (
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-sm text-white">bed</span>
              <span className="text-xs text-white">{design.bedrooms}</span>
            </div>
          )}
          {design.bathrooms && (
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-sm text-white">bathtub</span>
              <span className="text-xs text-white">{design.bathrooms}</span>
            </div>
          )}
        </motion.div>

        {/* Floating favorite button */}
        <motion.button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/70 backdrop-blur-sm text-white hover:bg-red-500/90"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="material-symbols-outlined text-sm">favorite</span>
        </motion.button>
      </div>

      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-transparent"
        initial={false}
        animate={{
          boxShadow: isHovered ? "0 0 20px 5px rgba(59, 130, 246, 0.5)" : "0 0 0px 0px rgba(59, 130, 246, 0)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
