"use client";

import { Post } from "@/generated/prisma";
import Image from "next/image";
import Link from "next/link";

export const BlogPostCard = ({ post }: { post: Post }) => {
  const description =
    post.content
      .replace(/<[^>]*>?/gm, "")
      .trim()
      .substring(0, 100) + "...";

  return (
    <Link href={`/blog/${post.id}`} className="block w-full h-full">
      <div className="group flex flex-col overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-white/10 h-full min-h-0">
        {/* Image Container */}
        <div className="overflow-hidden relative aspect-video w-full">
          <Image
            src={post.image || ""}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
            sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
          />
        </div>

        {/* Content Container */}
        <div className="flex flex-1 flex-col p-3 xs:p-4 sm:p-5 lg:p-6 min-h-0">
          {/* Title */}
          <h3 className="font-heading text-base xs:text-lg sm:text-xl lg:text-2xl font-bold leading-tight xs:leading-tight sm:leading-tight tracking-tight text-foreground group-hover:text-primary line-clamp-2 mb-2 xs:mb-3">
            {post.title}
          </h3>

          {/* Description */}
          <p className="flex-1 text-sm xs:text-sm sm:text-base text-muted-foreground line-clamp-2 xs:line-clamp-3 mb-3 xs:mb-4 leading-relaxed">
            {description}
          </p>

          {/* Date */}
          <p className="text-xs xs:text-sm text-muted-foreground leading-none mt-auto">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const BlogPostCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl border bg-card shadow-sm h-full min-h-0">
      {/* Image Skeleton */}
      <div className="aspect-video w-full relative overflow-hidden bg-gray-200 dark:bg-gray-700">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-3 xs:p-4 sm:p-5 lg:p-6 min-h-0 space-y-2 xs:space-y-3">
        {/* Title Skeleton */}
        <div className="h-5 xs:h-6 sm:h-7 lg:h-8 w-4/5 relative overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        {/* Description Skeleton Lines */}
        <div className="space-y-1 xs:space-y-2 flex-1">
          <div className="h-3 xs:h-4 sm:h-4 w-full relative overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
          <div className="h-3 xs:h-4 sm:h-4 w-5/6 relative overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
          <div className="h-3 xs:h-4 sm:h-4 w-4/5 relative overflow-hidden rounded bg-gray-200 dark:bg-gray-700 hidden xs:block">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
        </div>

        {/* Date Skeleton */}
        <div className="h-3 xs:h-4 w-1/3 relative overflow-hidden rounded bg-gray-200 dark:bg-gray-700 mt-auto">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};
