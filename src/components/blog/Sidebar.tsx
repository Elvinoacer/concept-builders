"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PopularPosts from "./PopularPosts";
import GlassCard from "@/components/ui-premium/glass-card";
import { Search } from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams?.get("search") || "");

  useEffect(() => {
    setQuery(searchParams?.get("search") || "");
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    const params = new URLSearchParams(searchParams?.toString() || "");
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-8 sm:space-y-10 w-full flex flex-col items-stretch">
      {/* Search Widget Container (Padding managed internally by GlassCard) */}
      <GlassCard className="w-full" hover={false}>
        <h3 className="text-lg sm:text-xl font-black text-gold uppercase tracking-tight mb-4 sm:mb-6 w-full text-left">
          Search Insights
        </h3>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search articles..."
            className="w-full bg-ink border-2 border-cb-border text-cream placeholder:text-cream-dim/40 py-3.5 sm:py-4 pl-5 pr-12 rounded-xl text-sm focus:outline-none focus:border-gold transition-all"
          />
          <Search className="w-5 h-5 text-cream-dim/40 absolute right-4 pointer-events-none" />
        </div>
      </GlassCard>

      {/* Popular Posts Area Component */}
      <div className="w-full">
        <PopularPosts />
      </div>

      {/* Community / Newsletter Access Widget */}
      <GlassCard className="bg-gold/5 border-gold/20 w-full" hover>
        <h3 className="text-lg sm:text-xl font-black text-gold uppercase tracking-tight mb-3 w-full text-left">
          Join the Circle
        </h3>
        <p className="text-cream-dim text-xs sm:text-sm font-medium mb-5 leading-relaxed w-full text-left">
          Get exclusive design tips and early access to new house plans
          delivered to your inbox.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-3 w-full flex flex-col items-stretch"
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="w-full bg-surface border-2 border-cb-border text-cream placeholder:text-cream-dim/30 py-3.5 sm:py-4 px-5 rounded-xl text-sm focus:outline-none focus:border-gold transition-all"
          />
          <button
            type="submit"
            className="w-full bg-gold text-ink font-black uppercase tracking-widest py-3.5 sm:py-4 rounded-xl text-xs hover:bg-gold-light active:scale-[0.99] transition-all"
          >
            Join Now
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default Sidebar;
