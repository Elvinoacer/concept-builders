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
    offscreen: {
      y: 40,
      opacity: 0,
      scale: 0.98,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.2,
        duration: 0.6,
      },
    },
  };

  const staggerVariants = {
    offscreen: { opacity: 0, y: 20 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Elements - Responsive scaling */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-4 xs:-left-6 sm:-left-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full blur-2xl xs:blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-4 xs:-right-6 sm:-right-8 w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl xs:blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerVariants}
          className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20"
        >
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-3 xs:mb-4">
            Latest Insights
          </h2>
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed sm:leading-normal">
            Discover expert tips, trends, and inspiration for your architectural
            journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-7 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
          {/* Featured Post */}
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            className="group relative bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl lg:rounded-3xl shadow-lg xs:shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/60 dark:border-gray-700/50 hover:border-blue-300/30 dark:hover:border-cyan-400/30"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

            <div className="relative h-60 xs:h-64 sm:h-72 md:h-80 lg:h-96 w-full overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
                priority
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
              />
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />

              {/* Featured Badge */}
              <div className="absolute top-3 xs:top-4 left-3 xs:left-4">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-2 xs:px-3 py-1 xs:py-1.5 text-xs xs:text-sm font-semibold rounded-full shadow-md xs:shadow-lg">
                  Featured
                </span>
              </div>
            </div>

            <div className="relative p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 z-10">
              <div className="flex items-center text-xs xs:text-sm text-gray-500 dark:text-gray-400 mb-2 xs:mb-3">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-sm xs:text-base mr-1 text-blue-500">
                    schedule
                  </span>
                  <span>Latest Post</span>
                </div>
              </div>

              <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4 leading-tight">
                <Link
                  href={`/blog/${featuredPost.id}`}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-300 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text hover:from-blue-600 hover:to-cyan-400"
                >
                  {featuredPost.title}
                </Link>
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-4 xs:mb-5 sm:mb-6 text-sm xs:text-base sm:text-lg leading-relaxed">
                Explore the latest insights and trends in modern architecture
                and design.
              </p>

              <Link
                href={`/blog/${featuredPost.id}`}
                className="inline-flex items-center font-semibold text-sm xs:text-base sm:text-lg bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 group/btn w-fit"
              >
                Read Article
                <span className="material-symbols-outlined ml-1 xs:ml-2 text-base xs:text-lg group-hover/btn:translate-x-1 transition-transform duration-300">
                  arrow_forward
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Secondary Posts */}
          <div className="flex flex-col gap-5 xs:gap-6 sm:gap-7 md:gap-8 lg:gap-10">
            {secondaryPosts.map((post, index) => (
              <motion.div
                key={post.title}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                transition={{ delay: index * 0.15 }}
                className="group relative bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-md xs:shadow-lg hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row items-stretch border border-gray-200/60 dark:border-gray-700/50 hover:border-blue-200/50 dark:hover:border-cyan-400/30 overflow-hidden"
              >
                {/* Content Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative h-40 xs:h-44 sm:h-48 md:h-52 sm:w-2/5 flex-shrink-0 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 20vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                  />
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent opacity-50 group-hover:opacity-20 transition-opacity duration-500" />
                </div>

                <div className="relative p-4 xs:p-5 sm:p-6 md:p-7 flex-1 flex flex-col justify-center z-10">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1 xs:mb-2">
                    <span className="material-symbols-outlined text-xs xs:text-sm mr-1 text-cyan-500">
                      article
                    </span>
                    <span>New Post</span>
                  </div>

                  <h4 className="font-bold text-lg xs:text-xl sm:text-2xl leading-tight text-gray-900 dark:text-white mb-2 xs:mb-3">
                    <Link
                      href={`/blog/${post.id}`}
                      className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-300 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text hover:from-blue-600 hover:to-cyan-400 line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </h4>

                  <p className="text-gray-600 dark:text-gray-300 text-xs xs:text-sm sm:text-base mb-3 xs:mb-4 leading-relaxed line-clamp-2">
                    Discover valuable insights and expert perspectives.
                  </p>

                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center font-medium text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors duration-300 group/link text-xs xs:text-sm sm:text-base w-fit"
                  >
                    Read More
                    <span className="material-symbols-outlined ml-1 text-base group-hover/link:translate-x-1 transition-transform duration-300">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10 xs:mt-12 sm:mt-14 md:mt-16 lg:mt-20"
        >
          <Link
            href="/blog"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-4 text-base sm:text-lg font-semibold rounded-xl xs:rounded-2xl hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 shadow-lg xs:shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:scale-105 group/cta"
          >
            Explore All Articles
            <span className="material-symbols-outlined ml-2 xs:ml-3 text-lg xs:text-xl group-hover/cta:translate-x-1 transition-transform duration-300">
              trending_flat
            </span>
          </Link>

          <p className="text-gray-500 dark:text-gray-400 mt-3 xs:mt-4 text-xs xs:text-sm">
            Discover more insights, tips, and architectural inspiration
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
