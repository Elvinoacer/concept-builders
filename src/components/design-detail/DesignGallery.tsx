'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DesignGallery = ({ images }: { images: { url: string, type: string }[] }) => {
  if (!images || images.length === 0) {
    return (
      <div className="aspect-video md:aspect-[4/3] rounded-lg bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const currentIndex = images.findIndex(img => img.url === selectedImage.url);
        const nextIndex = (currentIndex + 1) % images.length;
        setSelectedImage(images[nextIndex]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, selectedImage, images]);

  const handleThumbnailClick = (image: { url: string, type: string }) => {
    setSelectedImage(image);
    setIsPlaying(false);
  };

  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative group mb-4">
      <motion.div
        className="aspect-video md:aspect-[4/3] rounded-lg overflow-hidden shadow-lg relative"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div
          className="w-full h-full bg-center bg-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          style={{ backgroundImage: `url(${selectedImage.url})` }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            className="text-white bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full p-3 hover:from-blue-700 hover:to-cyan-500 transition-all"
            onClick={handlePlayPauseClick}
          >
            <span className="material-symbols-outlined text-4xl">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={`aspect-square rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl relative group/thumb border-2 ${selectedImage.url === image.url ? 'border-primary ring-2 ring-primary' : 'border-transparent'}`}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            onClick={() => handleThumbnailClick(image)}
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
