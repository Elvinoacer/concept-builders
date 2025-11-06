"use client";

import { Post } from "@/generated/prisma";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const PopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog/popular`);
        if (!res.ok) {
          throw new Error("Failed to fetch popular posts");
        }
        const result = await res.json();
        setPopularPosts(result.data);
      } catch (error) {
        console.error("Failed to fetch popular posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <PopularPostsSkeleton />;
  }

  return (
    <div className="rounded-lg border bg-card p-3 sm:p-4 lg:p-6 shadow-sm w-full">
      <h3 className="font-heading mb-3 sm:mb-4 lg:mb-6 text-base sm:text-lg lg:text-xl font-bold tracking-tight text-foreground leading-tight">
        Popular Posts
      </h3>
      {popularPosts.length > 0 ? (
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {popularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group flex items-start gap-3 sm:gap-4 lg:gap-5 w-full p-2 sm:p-3 rounded-lg hover:bg-accent/50 transition-all duration-200"
            >
              <div className="flex-shrink-0 relative">
                <Image
                  src={post.image || ""}
                  alt={post.title}
                  width={56}
                  height={56}
                  className="aspect-square rounded-md object-cover min-w-[56px] sm:min-w-[64px] lg:min-w-[72px]"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                  sizes="(max-width: 640px) 56px, (max-width: 1024px) 64px, 72px"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-semibold leading-tight text-foreground group-hover:text-primary line-clamp-2 text-sm sm:text-base lg:text-[15px]">
                  {post.title}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-none">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm sm:text-base text-muted-foreground text-center py-4 sm:py-6">
          No popular posts found.
        </p>
      )}
    </div>
  );
};

export const PopularPostsSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card p-3 sm:p-4 lg:p-6 shadow-sm w-full">
      {/* Skeleton Title */}
      <div className="mb-3 sm:mb-4 lg:mb-6 h-5 sm:h-6 lg:h-7 w-2/3 sm:w-1/2 relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      {/* Skeleton Posts */}
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 sm:gap-4 lg:gap-5 w-full p-2 sm:p-3"
          >
            {/* Skeleton Image */}
            <div className="h-14 w-14 sm:h-16 sm:w-16 lg:h-18 lg:w-18 flex-shrink-0 relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Skeleton Text Content */}
            <div className="flex-1 min-w-0 space-y-2 py-1">
              {/* Title Line 1 */}
              <div className="h-3 sm:h-4 w-full relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>

              {/* Title Line 2 */}
              <div className="h-3 sm:h-4 w-4/5 relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>

              {/* Date */}
              <div className="h-3 w-1/3 relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700 mt-2">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;
