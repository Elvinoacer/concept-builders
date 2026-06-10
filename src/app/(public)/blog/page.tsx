"use client";

import { BlogLayout } from "@/components/blog/BlogLayout";
import BlogListWithPaginationAndSearch from "@/components/blog/BlogListWithPaginationAndSearch";
import Sidebar from "@/components/blog/Sidebar";
import PageSection from "@/components/ui-premium/page-section";
import SectionHeading from "@/components/ui-premium/section-heading";

const BlogPage = () => {
  return (
    <BlogLayout>
      <PageSection variant="ink" className="pt-0">
        {/* Header Block Section */}
        <div className="mb-10 sm:mb-14 lg:mb-16">
          <SectionHeading
            title="Insights & Inspiration"
            subtitle="Explore the latest in architecture, design, and construction."
            align="center"
            gradient
          />
        </div>

        {/* Core Layout Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Blog List - Main Viewport Area (2/3 width on desktop) */}
          <main className="col-span-full lg:col-span-8 w-full min-w-0 order-1">
            <BlogListWithPaginationAndSearch />
          </main>

          {/* Sidebar Area Column (1/3 width on desktop) */}
          <aside className="col-span-full lg:col-span-4 w-full order-2 lg:sticky lg:top-24">
            <Sidebar />
          </aside>
        </div>
      </PageSection>
    </BlogLayout>
  );
};

export default BlogPage;
