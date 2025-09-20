"use client";
import React from "react";
import Image from "next/image";

const ProjectImages = ({ images }: { images: string[] }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-4 dark:text-white">
        Project Images
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
          >
            <Image
              src={image}
              alt={`Project Image ${index + 1}`}
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
        <div className="w-full flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-600">
          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
            add_photo_alternate
          </span>
        </div>
      </div>
      <button className="mt-2 md:mt-4 w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
        View All Images
      </button>
    </div>
  );
};

export default ProjectImages;
