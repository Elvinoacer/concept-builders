"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Post } from "@/generated/prisma";

interface BlogSectionProps {
  recentPosts: Post[];
}

const BlogSection = ({ recentPosts }: BlogSectionProps) => {
  if (!recentPosts.length) {
    return null;
  }

  const featuredPost = recentPosts[0];
  const secondaryPosts = recentPosts.slice(1, 3);

  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", bounce: 0.4, duration: 0.8 },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            From Our Blog
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            Insights, trends, and inspiration for your home-building journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Featured Post */}
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="relative h-80 w-full overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="p-6 md:p-8">
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-2">
                {/* The date is not in the new schema, so I will remove it */}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                <Link
                  href={`/blog/${featuredPost.id}`}
                  className="hover:text-blue-600 transition-colors duration-300"
                >
                  {featuredPost.title}
                </Link>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                By{" "}
                {/* The author is not in the new schema, so I will remove it */}
              </p>
              <Link
                href={`/blog/${featuredPost.id}`}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Read More
              </Link>
            </div>
          </motion.div>

          {/* Secondary Posts */}
          <div className="flex flex-col gap-8 md:gap-12">
            {secondaryPosts.map((post) => (
              <motion.div
                key={post.title}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.5 }}
                variants={cardVariants}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex items-center border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="relative h-full w-1/3 md:w-48 flex-shrink-0 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {/* The date is not in the new schema, so I will remove it */}
                  </div>
                  <h4 className="font-bold text-lg leading-tight text-gray-900 dark:text-white mb-2">
                    <Link
                      href={`/blog/${post.id}`}
                      className="hover:text-blue-600 transition-colors duration-300"
                    >
                      {post.title}
                    </Link>
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    By{" "}
                    {/* The author is not in the new schema, so I will remove it */}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-block bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-8 py-4 text-lg rounded-lg hover:from-blue-700 hover:to-cyan-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Continue to Our Blog
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
