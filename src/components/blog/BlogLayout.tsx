'use client';

import { BlogPostCardSkeleton } from "./BlogPostCard";
import { CategoriesSkeleton } from "./Categories";
import { PopularPostsSkeleton } from "./PopularPosts";

export const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 px-4 py-8 md:px-10 dark:bg-background">
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </div>
  );
};

export const BlogLayoutSkeleton = () => {
  return (
    <BlogLayout>
      <div className="mb-8 h-16 w-1/2 animate-pulse rounded-md bg-muted"></div> {/* BlogHeader Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="col-span-full md:col-span-8">
          {/* FeaturedPost Skeleton */}
          <div className="mb-8 h-80 w-full animate-pulse rounded-lg bg-muted"></div>
          {/* PostList Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogPostCardSkeleton />
            <BlogPostCardSkeleton />
            <BlogPostCardSkeleton />
          </div>
        </div>
        <aside className="col-span-full md:col-span-4 space-y-8">
          <CategoriesSkeleton />
          <PopularPostsSkeleton />
        </aside>
      </div>
    </BlogLayout>
  );
};
