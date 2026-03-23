"use client";

import React from "react";
import BlogHeader from "@/components/blog/BlogHeader";
import Sidebar from "@/components/blog/Sidebar";
import { BlogLayout } from "@/components/blog/BlogLayout";
import BlogListWithPaginationAndSearch from "@/components/blog/BlogListWithPaginationAndSearch";

import PageSection from "@/components/ui-premium/page-section";
import SectionHeading from "@/components/ui-premium/section-heading";

const BlogPage = () => {
  return (
    <BlogLayout>
      <PageSection variant="ink" className="pt-8 sm:pt-12">
        <SectionHeading 
          title="Insights & Inspiration" 
          subtitle="Explore the latest in architecture, design, and construction."
          align="center"
          gradient
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12">
          {/* Blog List - Main Content */}
          <main className="col-span-full lg:col-span-8 xl:col-span-9 w-full min-w-0">
            <BlogListWithPaginationAndSearch />
          </main>

          {/* Sidebar - Secondary Content */}
          <aside className="col-span-full lg:col-span-4 xl:col-span-3 w-full">
            <div className="space-y-10 sticky top-24">
              <Sidebar />
            </div>
          </aside>
        </div>
      </PageSection>
    </BlogLayout>
  );
};

export default BlogPage;
