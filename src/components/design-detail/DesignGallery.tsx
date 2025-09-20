'use client';

import { motion } from 'framer-motion';

const DesignGallery = ({ images }: { images: { url: string, type: string }[] }) => {
  const mainImage = images[0];
  const thumbnails = images.slice(1);

  return (
    <div className="relative group mb-4">
      <motion.div
        className="aspect-video md:aspect-[4/3] rounded-lg overflow-hidden shadow-lg relative"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div
          className="w-full h-full bg-center bg-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          style={{ backgroundImage: `url(${mainImage.url})` }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="text-white bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full p-3 hover:from-blue-700 hover:to-cyan-500 transition-all">
            <span className="material-symbols-outlined text-4xl">play_arrow</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-4">
        {thumbnails.map((image, index) => (
          <motion.div
            key={index}
            className="aspect-square rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl relative group/thumb"
            whileHover={{ scale: 1.1, zIndex: 10 }}
          >
            <div
              className="w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${image.url})` }}
            ></div>
            {image.type === '3d' && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-2xl">3d_rotation</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DesignGallery;
