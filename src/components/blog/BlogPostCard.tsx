'use client';

import { Post } from "@/generated/prisma";
import Image from "next/image";
import Link from "next/link";

export const BlogPostCard = ({ post }: { post: Post }) => {
  const description = post.content.replace(/<[^>]*>?/gm, '').trim().substring(0, 100) + '...';

  return (
    <Link href={`/blog/${post.id}`}>
      <div className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-white/10">
        <div className="overflow-hidden">
          <Image
            src={post.image || ''}
            alt={post.title}
            width={400}
            height={240}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <h3 className="font-heading text-lg font-bold leading-tight tracking-tight text-foreground group-hover:text-primary">
            {post.title}
          </h3>
          <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const BlogPostCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="h-48 w-full animate-pulse bg-muted"></div>
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted"></div>
        <div className="mt-1 h-4 w-5/6 animate-pulse rounded bg-muted"></div>
        <div className="mt-5 h-3 w-1/3 animate-pulse rounded bg-muted"></div>
      </div>
    </div>
  );
};
