"use client";

import React from "react";
import BlogHeader from "@/components/blog/BlogHeader";
import Sidebar from "@/components/blog/Sidebar";
import { BlogLayout } from "@/components/blog/BlogLayout";
import BlogListWithPaginationAndSearch from "@/components/blog/BlogListWithPaginationAndSearch";

const BlogPage = () => {
  return (
    <BlogLayout>
      <BlogHeader />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 w-full max-w-[100vw] px-4 sm:px-6 lg:px-8">
        {/* Blog List - Main Content */}
        <main className="col-span-full lg:col-span-8 xl:col-span-9 2xl:col-span-8 w-full min-w-0">
          <BlogListWithPaginationAndSearch />
        </main>

        {/* Sidebar - Secondary Content */}
        <aside className="col-span-full lg:col-span-4 xl:col-span-3 2xl:col-span-4 w-full">
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 sticky top-6">
            <Sidebar />
          </div>
        </aside>
      </div>
    </BlogLayout>
  );
};

export default BlogPage;
