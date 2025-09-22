import { blogPostsData } from "@/lib/blog-data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FeaturedPost = () => {
  const featuredPost = blogPostsData.find(post => post.status === 'Published' && post.image);

  if (!featuredPost) {
    return null; // Or some fallback UI
  }

  // Create a short description from the content, stripping HTML tags.
  const description = featuredPost.content.replace(/<[^>]*>?/gm, '').trim().substring(0, 120) + '...';

  return (
    <Link href={`/blog/${featuredPost.slug}`}>
      <div className="p-3 md:p-4 @container bg-white rounded-lg border border-gray-200 shadow-sm mb-8 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col items-center justify-center rounded-lg @xl:flex-row @xl:items-center">
          <div className="w-full md:w-1/2 bg-center bg-no-repeat aspect-video bg-cover rounded-md">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              width={300}
              height={180}
              className="rounded-md w-full h-auto"
            />
          </div>
          <div className="flex w-full md:w-1/2 min-w-72 grow flex-col items-center justify-center gap-2 py-4 @xl:pl-6 text-center">
            <p
              className="text-sm font-bold leading-normal bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400"
            >
              Featured
            </p>
            <h3 className="text-lg md:text-xl font-bold leading-tight tracking-tight dark:text-white">
              {featuredPost.title}
            </h3>
            <p className="text-sm md:text-base font-normal leading-relaxed dark:text-gray-400">
              {description}
            </p>
            <Button className="mt-2 max-w-fit">Read More</Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPost;