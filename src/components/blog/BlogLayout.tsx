"use client";

import { BlogPostCardSkeleton } from "./BlogPostCard";
import { PopularPostsSkeleton } from "./PopularPosts";

export const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 bg-ink w-full min-h-screen overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {children}
      </div>
    </div>
  );
};

export const BlogLayoutSkeleton = () => {
  return (
    <BlogLayout>
      <div className="space-y-12">
        {/* BlogHeader Skeleton */}
        <div className="max-w-3xl">
          <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-surface mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
          <div className="h-6 w-1/2 animate-pulse rounded-xl bg-surface relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
          {/* Main Content Area Skeleton */}
          <div className="col-span-full lg:col-span-8 xl:col-span-9 space-y-12 min-w-0">
            <div className="w-full h-[300px] sm:h-[400px] animate-pulse rounded-3xl bg-surface relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <BlogPostCardSkeleton />
              <BlogPostCardSkeleton />
              <BlogPostCardSkeleton />
              <BlogPostCardSkeleton />
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <aside className="col-span-full lg:col-span-4 xl:col-span-3 space-y-8 lg:sticky lg:top-24">
            <div className="h-44 w-full animate-pulse rounded-3xl bg-surface relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
            <PopularPostsSkeleton />
          </aside>
        </div>
      </div>
    </BlogLayout>
  );
};
