'use client';

import React, { useState, useEffect } from 'react';
import BlogHeader from "@/components/blog/BlogHeader";
import FeaturedPost, { FeaturedPostSkeleton } from "@/components/blog/FeaturedPost";
import Sidebar from "@/components/blog/Sidebar";
import { Post } from "@/generated/prisma";
import { BlogLayout, BlogLayoutSkeleton } from "@/components/blog/BlogLayout";
import { BlogPostCard, BlogPostCardSkeleton } from "@/components/blog/BlogPostCard";
import { CategoriesSkeleton } from '@/components/blog/Categories';
import { PopularPostsSkeleton } from '@/components/blog/PopularPosts';

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog`);
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  if (loading) {
    return (
        <BlogLayout>
            <BlogHeader />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="col-span-full md:col-span-8">
                    <FeaturedPostSkeleton />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
  }

  return (
    <BlogLayout>
      <BlogHeader />
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">No Posts Yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">There are no blog posts to display. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <main className="col-span-full md:col-span-8">
            <FeaturedPost post={posts[0]} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {posts.slice(1).map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </main>
          <aside className="col-span-full md:col-span-4 space-y-8">
            <Sidebar />
          </aside>
        </div>
      )}
    </BlogLayout>
  );
};

export default BlogPage;
