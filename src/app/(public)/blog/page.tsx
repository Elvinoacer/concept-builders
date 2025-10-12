'use client';

import React, { useState, useEffect } from 'react';
import BlogHeader from "@/components/blog/BlogHeader";
import FeaturedPost from "@/components/blog/FeaturedPost";
import PostList from "@/components/blog/PostList";
import Sidebar from "@/components/blog/Sidebar";
import { Post } from "@/generated/prisma";

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch(`/api/blog`);
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 px-4 py-8 md:px-10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <BlogHeader />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="col-span-full md:col-span-8">
            <FeaturedPost post={posts[0]} />
            <PostList posts={posts.slice(1)} />
          </div>
          <aside className="col-span-full md:col-span-4 space-y-8">
            <Sidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
