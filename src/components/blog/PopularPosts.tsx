"use client";

import { Post } from "@/generated/prisma";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import GlassCard from "@/components/ui-premium/glass-card";
import { motion } from "framer-motion";

const PopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog/popular`);
        if (!res.ok) {
          throw new Error("Failed to fetch popular posts");
        }
        const result = await res.json();
        setPopularPosts(result.data);
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
    <GlassCard className="p-8" hover={false}>
      <h3 className="text-xl font-black text-gold uppercase tracking-tight mb-8">
        Trending Stories
      </h3>
      {popularPosts.length > 0 ? (
        <div className="space-y-8">
          {popularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/blog/${post.id}`}
                className="group flex items-start gap-5 w-full"
              >
                <div className="flex-shrink-0 relative w-20 h-20 overflow-hidden rounded-xl border-2 border-cb-border group-hover:border-gold/50 transition-colors">
                  <Image
                    src={post.image || ""}
                    alt={post.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="font-bold text-white text-sm leading-tight group-hover:text-gold transition-colors duration-300 line-clamp-2 uppercase tracking-tight mb-2">
                    {post.title}
                  </p>
                  <p className="text-[10px] font-black text-gold/40 uppercase tracking-[0.2em]">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-xs font-black text-cream-dim/40 uppercase tracking-widest text-center py-4">
          No stories yet.
        </p>
      )}
    </GlassCard>
  );
};

export const PopularPostsSkeleton = () => {
  return (
    <div className="rounded-3xl border-2 border-cb-border bg-card p-8 shadow-xl w-full animate-pulse">
      <div className="mb-8 h-6 w-1/2 bg-surface rounded-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-5 w-full">
            <div className="h-20 w-20 flex-shrink-0 bg-surface rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 w-full bg-surface rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
              <div className="h-3 w-1/3 bg-surface rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;
