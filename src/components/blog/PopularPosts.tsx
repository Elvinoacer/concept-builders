'use client';

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`);
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const posts = await res.json();
        setPopularPosts(posts.sort((a: Post, b: Post) => (b.views || 0) - (a.views || 0)).slice(0, 3));
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
    <div className="rounded-lg border bg-card p-4 shadow-sm md:p-6">
      <h3 className="font-heading mb-4 text-lg font-bold tracking-tight text-foreground">
        Popular Posts
      </h3>
      {popularPosts.length > 0 ? (
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group flex items-start gap-4">
              <Image
                src={post.image || ''}
                alt={post.title}
                width={64}
                height={64}
                className="aspect-square rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold leading-tight text-foreground group-hover:text-primary line-clamp-2">
                  {post.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No popular posts found.</p>
      )}
    </div>
  );
};

export const PopularPostsSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm md:p-6">
      <div className="mb-4 h-6 w-3/4 animate-pulse rounded-md bg-muted"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-md bg-muted"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
              <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted"></div>
              <div className="mt-1 h-3 w-1/3 animate-pulse rounded-md bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;

