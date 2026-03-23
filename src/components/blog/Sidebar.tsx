"use client";

import PopularPosts from "./PopularPosts";
import GlassCard from "@/components/ui-premium/glass-card";

const Sidebar = () => {
  return (
    <div className="space-y-10 w-full">
      <GlassCard className="p-8" hover={false}>
        <h3 className="text-xl font-black text-gold uppercase tracking-tight mb-6">
          Search Insights
        </h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search articles..."
            className="w-full bg-ink border-2 border-cb-border text-cream py-4 px-6 rounded-xl text-sm focus:outline-none focus:border-gold transition-all"
          />
        </div>
      </GlassCard>

      <PopularPosts />
      
      {/* Community/Newsletter Plug */}
      <GlassCard className="p-8 bg-gold/5 border-gold/20" hover>
        <h3 className="text-xl font-black text-gold uppercase tracking-tight mb-4">
          Join the Circle
        </h3>
        <p className="text-cream-dim text-sm font-medium mb-6 leading-relaxed">
          Get exclusive design tips and early access to new house plans delivered to your inbox.
        </p>
        <div className="space-y-3">
          <input 
            type="email" 
            placeholder="your@email.com"
            className="w-full bg-surface border-2 border-cb-border text-cream py-4 px-6 rounded-xl text-sm focus:outline-none focus:border-gold transition-all"
          />
          <button className="w-full bg-gold text-ink font-black uppercase tracking-widest py-4 rounded-xl text-xs hover:bg-gold-light transition-all">
            Join Now
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Sidebar;
