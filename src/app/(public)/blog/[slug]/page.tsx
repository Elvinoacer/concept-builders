"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Post } from "@/generated/prisma";

const BlogPostPage = () => {
  const { slug } = useParams();
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium">
            Loading blog post...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8">
        <div className="text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Error Loading Post
          </h2>
          <p className="text-red-600 dark:text-red-400 text-base sm:text-lg">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8">
        <div className="text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Post Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            The blog post you're looking for doesn't exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        <article className="bg-white dark:bg-gray-900 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          {post.image && (
            <div className="relative w-full aspect-video sm:aspect-[21/9] lg:aspect-[16/6]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1280px) 80vw, 70vw"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="p-4 xs:p-5 sm:p-6 lg:p-8 xl:p-10">
            {/* Title */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 lg:mb-10">
              {post.author && (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  By {post.author}
                </span>
              )}
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Content Body */}
            <div
              className="prose prose-sm xs:prose-base sm:prose-lg lg:prose-xl dark:prose-invert max-w-none
                         prose-headings:font-bold prose-headings:tracking-tight
                         prose-h1:text-2xl xs:prose-h1:text-3xl sm:prose-h1:text-4xl
                         prose-h2:text-xl xs:prose-h2:text-2xl sm:prose-h2:text-3xl
                         prose-h3:text-lg xs:prose-h3:text-xl sm:prose-h3:text-2xl
                         prose-p:leading-relaxed prose-p:my-4
                         prose-img:rounded-lg xs:prose-img:rounded-xl
                         prose-blockquote:border-l-4 prose-blockquote:border-blue-500
                         prose-blockquote:pl-4 xs:prose-blockquote:pl-6
                         prose-ul:my-4 prose-ol:my-4
                         prose-li:my-1
                         prose-a:text-blue-600 dark:prose-a:text-blue-400
                         prose-a:no-underline hover:prose-a:underline
                         prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white
                         prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                         prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                         prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800
                         prose-pre:rounded-lg xs:prose-pre:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Back to Blog Link */}
        <div className="mt-6 sm:mt-8 lg:mt-10 text-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 xs:px-6 py-2.5 xs:py-3 text-sm xs:text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 xs:w-5 xs:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
