"use client";

import { Post } from "@/generated/prisma";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui-premium/glass-card";
import { Calendar, ArrowRight } from "lucide-react";

export const BlogPostCard = ({ post, index = 0 }: { post: Post; index?: number }) => {
  const description =
    post.content
      .replace(/<[^>]*>?/gm, "")
      .trim()
      .substring(0, 120) + "...";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/blog/${post.id}`} className="block h-full">
        <GlassCard className="p-0 sm:p-0 md:p-0 h-full flex flex-col group" hover>
          {/* Image Container */}
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={post.image || ""}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          </div>

          {/* Content Container */}
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-4 text-[10px] font-black text-gold uppercase tracking-widest bg-gold/5 w-fit px-2 py-1 rounded border border-gold/10">
              <Calendar className="w-3 h-3" />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-black text-white mb-4 leading-tight uppercase tracking-tight group-hover:text-gold transition-colors duration-300 line-clamp-2">
              {post.title}
            </h3>

            {/* Description */}
            <p className="flex-1 text-sm sm:text-base text-cream-dim line-clamp-3 mb-8 font-medium leading-relaxed">
              {description}
            </p>

            {/* Footer Action */}
            <div className="flex items-center gap-2 text-[10px] font-black text-gold uppercase tracking-[0.2em] transform transition-transform duration-300 group-hover:translate-x-2">
              <span>Read Full Story</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
};

export const BlogPostCardSkeleton = ({ index = 0 }: { index?: number }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border-2 border-cb-border bg-card shadow-xl h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[16/10] w-full relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-6 sm:p-8 space-y-4">
        <div className="h-5 w-24 bg-surface rounded"></div>
        <div className="space-y-2">
          <div className="h-8 w-full bg-surface rounded-lg"></div>
          <div className="h-8 w-4/5 bg-surface rounded-lg"></div>
        </div>
        <div className="space-y-2 flex-grow">
          <div className="h-4 w-full bg-surface rounded"></div>
          <div className="h-4 w-full bg-surface rounded"></div>
          <div className="h-4 w-3/4 bg-surface rounded"></div>
        </div>
        <div className="h-4 w-32 bg-surface rounded mt-auto"></div>
      </div>
    </div>
  );
};
