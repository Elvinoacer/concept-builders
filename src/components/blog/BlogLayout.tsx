"use client";

import { BlogPostCardSkeleton } from "./BlogPostCard";
import { CategoriesSkeleton } from "./Categories";
import { PopularPostsSkeleton } from "./PopularPosts";

export const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 bg-white dark:bg-background px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 lg:py-8 xl:py-10 w-full max-w-[100vw] overflow-x-hidden">
      <div className="mx-auto w-full max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        {children}
      </div>
    </div>
  );
};

export const BlogLayoutSkeleton = () => {
  return (
    <BlogLayout>
      {/* BlogHeader Skeleton */}
      <div className="mb-6 sm:mb-8 lg:mb-10 xl:mb-12">
        <div className="h-8 xs:h-10 sm:h-12 lg:h-14 w-3/4 xs:w-2/3 sm:w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 mb-2 sm:mb-3"></div>
        <div className="h-4 xs:h-5 sm:h-6 w-full xs:w-4/5 sm:w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 w-full">
        {/* Main Content Area Skeleton */}
        <div className="col-span-full lg:col-span-8 xl:col-span-9 2xl:col-span-8 space-y-6 sm:space-y-8 lg:space-y-10">
          {/* FeaturedPost Skeleton */}
          <div className="w-full h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>

          {/* PostList Skeleton */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
            <BlogPostCardSkeleton />
            <BlogPostCardSkeleton />
            <BlogPostCardSkeleton />
            <BlogPostCardSkeleton />
            <BlogPostCardSkeleton />
            <BlogPostCardSkeleton />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <aside className="col-span-full lg:col-span-4 xl:col-span-3 2xl:col-span-4 space-y-6 sm:space-y-8 lg:space-y-10">
          <CategoriesSkeleton />
          <PopularPostsSkeleton />
        </aside>
      </div>
    </BlogLayout>
  );
};
