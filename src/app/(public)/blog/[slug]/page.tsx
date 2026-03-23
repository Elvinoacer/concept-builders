"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Post } from "@/generated/prisma";
import PageSection from "@/components/ui-premium/page-section";
import GlassCard from "@/components/ui-premium/glass-card";
import GoldButton from "@/components/ui-premium/gold-button";
import SectionHeading from "@/components/ui-premium/section-heading";
import { ArrowLeft, User, Calendar, Loader2, AlertCircle } from "lucide-react";

const BlogPostPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/blog/${slug}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to fetch blog post");
          }
          const result = await res.json();
          setPost(result.data);
        } catch (err: any) {
          setError(err.message || "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <PageSection variant="ink" className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 text-gold animate-spin mx-auto" />
          <p className="text-xl text-cream-dim font-black uppercase tracking-widest">
            Fetching Story...
          </p>
        </div>
      </PageSection>
    );
  }

  if (error) {
    return (
      <PageSection variant="ink" className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto space-y-6">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
          <h2 className="text-3xl font-black text-gold uppercase">
            Access Error
          </h2>
          <p className="text-cream-dim font-medium">
            {error}
          </p>
          <GoldButton
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry Access
          </GoldButton>
        </div>
      </PageSection>
    );
  }

  if (!post) {
    return (
      <PageSection variant="ink" className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 mx-auto text-cream-dim/20">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gold uppercase">
            Not Found
          </h2>
          <p className="text-cream-dim font-medium">
            The article you seek has moved or does not exist.
          </p>
          <GoldButton
            onClick={() => window.history.back()}
            className="mt-4"
          >
            Return to Blog
          </GoldButton>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection variant="ink" className="pt-8 sm:pt-12">
      <div className="max-w-4xl mx-auto">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard className="p-0 sm:p-0 md:p-0 overflow-hidden" hover={false}>
            {/* Featured Image */}
            {post.image && (
              <div className="relative w-full aspect-video lg:aspect-[21/9]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              </div>
            )}

            {/* Content Container */}
            <div className="p-6 sm:p-10 lg:p-14">
              {/* Meta Top */}
              <div className="flex flex-wrap items-center gap-6 mb-8 text-xs sm:text-sm font-black text-gold uppercase tracking-[0.2em]">
                {post.author && (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-10 leading-tight uppercase tracking-tight">
                {post.title}
              </h1>

              {/* Content Body */}
              <div
                className="prose prose-invert max-w-none
                           prose-headings:font-black prose-headings:text-gold prose-headings:uppercase prose-headings:tracking-widest
                           prose-p:text-cream-dim prose-p:leading-relaxed prose-p:text-lg
                           prose-img:rounded-2xl prose-img:border-2 prose-img:border-cb-border
                           prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-surface prose-blockquote:p-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                           prose-a:text-gold prose-a:font-black prose-a:no-underline hover:prose-a:underline
                           prose-strong:text-gold prose-strong:font-black
                           prose-code:text-gold prose-code:bg-surface prose-code:px-2 prose-code:rounded
                           prose-pre:bg-ink prose-pre:border-2 prose-pre:border-cb-border prose-pre:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </GlassCard>
        </motion.article>

        {/* Back to Blog Button */}
        <div className="mt-12 text-center">
          <GoldButton
            onClick={() => window.history.back()}
            icon={<ArrowLeft className="w-5 h-5" />}
          >
            Back to Insights
          </GoldButton>
        </div>
      </div>
    </PageSection>
  );
};

export default BlogPostPage;
