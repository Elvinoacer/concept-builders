"use client";

import React from "react";
import SectionHeading from "@/components/ui-premium/section-heading";
import GoldButton from "@/components/ui-premium/gold-button";
import { ChevronDown, Mail } from "lucide-react";

const BlogHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between w-full mb-12 sm:mb-16 gap-8">
      {/* Page Title Section */}
      <div className="flex-1">
        <SectionHeading
          title="Insights & Inspiration"
          subtitle="Discover the latest in architecture, luxury design, and modern construction from our expert team."
          level={1}
          gradient
          className="mb-0"
        />
      </div>

      {/* Action Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
        {/* Sort Dropdown */}
        <div className="relative group min-w-[180px]">
          <select className="appearance-none w-full bg-surface border-2 border-cb-border text-cream py-4 px-6 pr-12 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:border-gold transition-all duration-300">
            <option value="latest">Latest Feed</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending Now</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gold w-5 h-5 pointer-events-none group-hover:scale-110 transition-transform" />
        </div>

        {/* Subscribe */}
        <GoldButton 
          icon={<Mail className="w-5 h-5" />}
          className="whitespace-nowrap"
        >
          Subscribe
        </GoldButton>
      </div>
    </div>
  );
};

export default BlogHeader;
