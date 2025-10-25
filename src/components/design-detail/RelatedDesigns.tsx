'use client';

import { useEffect, useState } from 'react';
import { Design } from '@/generated/prisma';
import Link from 'next/link';
import Image from 'next/image';

const RelatedDesigns = ({ categoryId, currentDesignId }: { categoryId: string | null, currentDesignId: string }) => {
  const [relatedDesigns, setRelatedDesigns] = useState<Design[]>([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<number[]>([]);

  useEffect(() => {
    const fetchRelatedDesigns = async () => {
      if (!categoryId) return;
      try {
        const response = await fetch(
          `/api/designs?categoryId=${categoryId}&limit=5&exclude=${currentDesignId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch related designs');
        }
        const data = await response.json();
        setRelatedDesigns(data.designs);
        setCurrentImageIndexes(new Array(data.designs.length).fill(0));
      } catch (error) {
        console.error(error);
      }
    };

    fetchRelatedDesigns();
  }, [categoryId]);

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">Related Designs</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {relatedDesigns.map((design) => {
          const imageUrls = design.files?.filter(
            (file) => file.type === 'IMAGE'
          ).map(file => file.url);
          return (
            <Link href={`/designs/${design.id}`} key={design.id}>
              <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                {imageUrls && imageUrls.length > 0 && (
                  <Image
                    src={imageUrls[0]}
                    alt={design.name}
                    width={400}
                    height={300}
                    className="w-full"
                  />
                )}
                <div className="px-6 py-4 min-h-[10rem]">
                  <div className="font-bold text-xl mb-2 dark:text-white">{design.name}</div>
                  <p className="text-gray-700 text-base dark:text-gray-300 h-20 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
                    {design.description}
                  </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 bg-gradient-to-r from-blue-600 to-cyan-400 text-white dark:text-white">
                    ${design.basePrice}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedDesigns;
