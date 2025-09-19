"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export function DesignGallery({ images, renderings, floorPlan }: { images: string[], renderings: string[], floorPlan: string }) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="lg:col-span-2">
      <div className="relative group mb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg relative"
        >
          <div
            className="w-full h-full bg-center bg-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            style={{ backgroundImage: `url("${mainImage}")` }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition-all">
              <span className="material-symbols-outlined text-4xl">play_arrow</span>
            </button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-8">
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            className={`aspect-square rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${mainImage === image ? 'border-2 border-[var(--primary-color)] ring-2 ring-[var(--primary-color)]' : ''}`}
            onClick={() => setMainImage(image)}
          >
            <div
              className="w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url("${image}")` }}
            ></div>
          </motion.div>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3D Renderings</h2>
        <div className="grid grid-cols-2 gap-4">
          {renderings.map((rendering, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-64 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url("${rendering}")` }}
            ></motion.div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Floor Plan Preview</h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-[500px] bg-center bg-no-repeat bg-contain rounded-lg border border-gray-200"
          style={{ backgroundImage: `url("${floorPlan}")` }}
        ></motion.div>
      </section>
    </div>
  );
}
