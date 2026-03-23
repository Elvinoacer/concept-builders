"use client";
import React from "react";
import Image from "next/image";

const ProjectImages = ({ images }: { images: string[] }) => {
  return (
    <div className="rounded-lg border border-cb-border bg-card p-6 shadow-sm">
      <h2 className="text-base md:text-lg font-semibold text-cream mb-2 md:mb-4">
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
        <div className="w-full flex items-center justify-center bg-surface rounded-lg hover:bg-surface/70 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-cream-dim">
            add_photo_alternate
          </span>
        </div>
      </div>
      <button className="mt-2 md:mt-4 w-full flex items-center justify-center gap-2 rounded-md border border-cb-border bg-surface px-4 py-2 text-sm font-semibold text-cream-dim shadow-sm hover:bg-card transition-colors">
        View All Images
      </button>
    </div>
  );
};

export default ProjectImages;
