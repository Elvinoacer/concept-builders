'use client';

import React from 'react';
import BlogHeader from "@/components/blog/BlogHeader";
import Sidebar from "@/components/blog/Sidebar";
import { BlogLayout } from "@/components/blog/BlogLayout";
import BlogListWithPaginationAndSearch from "@/components/blog/BlogListWithPaginationAndSearch";

const BlogPage = () => {
  return (
    <BlogLayout>
      <BlogHeader />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <BlogListWithPaginationAndSearch />
        <aside className="col-span-full md:col-span-4 space-y-8">
          <Sidebar />
        </aside>
      </div>
    </BlogLayout>
  );
};

export default BlogPage;
