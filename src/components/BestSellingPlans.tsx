"use client";
import Image from "next/image";

import Link from "next/link";
import { Design } from "@/generated/prisma";

interface BestSellingPlansProps {
  bestSellingPlans: (Design & {
    files: { url: string }[];
    images: { url: string }[];
    category: { name: string } | null;
  })[];
}

const BestSellingPlans = ({ bestSellingPlans }: BestSellingPlansProps) => {
  return (
    <section className="py-8 md:py-12 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 dark:text-white">
          Best Selling Plans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {bestSellingPlans.map((design) => (
            <div
              key={design.id}
              className="border rounded-lg overflow-hidden shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-transform hover:scale-[1.02]"
            >
              <div className="relative h-48 sm:h-56 md:h-64 w-full">
                <Image
                  src={
                    design.images?.[0]?.url || "/images/category-placeholder.png"
                  }
                  alt={design.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2 dark:text-white line-clamp-1">
                  {design.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  {design.category?.name}
                </p>
                <div className="mt-6 text-center">
                  <Link
                    href={`/designs/${design.id}`}
                    className="inline-block bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 text-base rounded-lg hover:from-blue-700 hover:to-cyan-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellingPlans;
