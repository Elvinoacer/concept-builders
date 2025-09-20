'use client';

import { motion } from 'framer-motion';

const RelatedDesigns = ({ relatedDesigns }) => {
  return (
    <section className="mt-8 md:mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center tracking-tight dark:text-white">You may also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 [perspective:1000px]">
        {relatedDesigns.map((design, index) => (
          <motion.div
            key={index}
            className="showcase-item group"
            whileHover={{ rotateY: 10, rotateX: 5, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {design.imageUrl && (
                <div
                  className="w-full bg-center bg-no-repeat aspect-video sm:aspect-[3/4] bg-cover rounded-lg shadow-2xl overflow-hidden showcase-image"
                  style={{ backgroundImage: `url(${design.imageUrl})` }}
                ></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.div
                className="absolute bottom-0 left-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500"
                initial={{ y: 20 }}
                whileHover={{ y: 0 }}
              >
                <h3 className="text-xl font-bold text-white">{design.name}</h3>
                <p className="text-sm text-gray-200 mt-1">{design.description}</p>
                <p className="text-lg font-bold text-[var(--primary-color)] mt-2">{design.price}</p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedDesigns;