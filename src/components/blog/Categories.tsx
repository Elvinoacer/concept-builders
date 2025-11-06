"use client";

import { categories } from "@/lib/dummydata";

const Categories = () => {
  return (
    <div className="rounded-lg border bg-card p-3 sm:p-4 lg:p-6 shadow-sm w-full">
      <h3 className="font-heading mb-3 sm:mb-4 lg:mb-6 text-base sm:text-lg lg:text-xl font-bold tracking-tight text-foreground leading-tight">
        Categories
      </h3>
      <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5">
        {categories.map((category, index) => (
          <li key={index}>
            <a
              className="block w-full text-sm sm:text-base lg:text-[15px] text-muted-foreground transition-colors hover:text-primary py-1.5 sm:py-2 lg:py-2.5 px-2 sm:px-3 rounded-md hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
              href="#"
            >
              <span className="flex items-center justify-between w-full">
                <span className="truncate">{category.name}</span>
                <span className="text-xs sm:text-sm text-muted-foreground/60 ml-2 flex-shrink-0">
                  ({category.count || 0})
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const CategoriesSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card p-3 sm:p-4 lg:p-6 shadow-sm w-full">
      {/* Title Skeleton */}
      <div className="mb-3 sm:mb-4 lg:mb-6 h-5 sm:h-6 lg:h-7 w-2/3 sm:w-1/2 relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      {/* Category Items Skeleton */}
      <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5">
        {[...Array(5)].map((_, index) => (
          <li
            key={index}
            className="flex items-center justify-between py-1.5 sm:py-2 lg:py-2.5 px-2 sm:px-3"
          >
            {/* Category Name Skeleton */}
            <div
              className={`h-4 sm:h-5 relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700 ${
                index % 3 === 0 ? "w-3/4" : index % 3 === 1 ? "w-2/3" : "w-1/2"
              }`}
            >
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Count Skeleton */}
            <div className="h-3 sm:h-4 w-8 sm:w-10 ml-2 relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
