
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
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg mb-4">
          <Image
            src={selectedImage}
            alt="Selected Design Image"
            layout="fill"
            objectFit="cover"
            className="bg-center"
          />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === image ? 'border-primary ring-2 ring-primary' : 'border-transparent'}`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`Design Image ${index + 1}`}
                width={100}
                height={100}
                objectFit="cover"
                className="w-full h-full bg-center bg-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignImageViewer;
