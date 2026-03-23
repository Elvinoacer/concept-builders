
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface DesignImageViewerProps {
  images: string[];
}

const DesignImageViewer: React.FC<DesignImageViewerProps> = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(images.length > 0 ? images[0] : '');

  return (
    <div className="lg:col-span-1">
      <div className="relative">
        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-cb-border mb-4 bg-surface">
          <Image
            src={selectedImage}
            alt="Selected Design Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${selectedImage === image ? 'border-gold ring-2 ring-gold shadow-gold/20' : 'border-cb-border hover:border-gold/30'}`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`Design Image ${index + 1}`}
                width={150}
                height={150}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignImageViewer;
