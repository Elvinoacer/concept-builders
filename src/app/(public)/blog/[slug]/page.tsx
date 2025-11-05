'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Post } from '@/generated/prisma';

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
            throw new Error(errorData.message || 'Failed to fetch blog post');
          }
          const result = await res.json();
          setPost(result.data);
        } catch (err: any) {
          setError(err.message || 'An unexpected error occurred.');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Blog post not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <article className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        {post.image && (
          <div className="relative w-full h-64 md:h-80 lg:h-96">
            <Image
              src={post.image}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
            />
          </div>
        )}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-6">
            {post.author && <span className="mr-4">By {post.author}</span>}
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
