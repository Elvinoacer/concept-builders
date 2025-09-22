import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/types";

const PostListItem = ({ post }: { post: BlogPost }) => {
  // Create a short description from the content, stripping HTML tags.
  const description = post.content.replace(/<[^>]*>?/gm, '').trim().substring(0, 100) + '...';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-lg overflow-hidden"
    >
      <div className="w-full aspect-video">
        <Image
          src={post.image}
          alt={post.title}
          width={300}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <h4 className="text-gray-800 text-lg font-bold leading-snug line-clamp-2 dark:text-white mb-2">
          {post.title}
        </h4>
        <p className="text-gray-600 text-sm font-normal leading-relaxed line-clamp-3 dark:text-gray-400 mb-2">
          {description}
        </p>
        <p className="text-gray-500 text-sm font-normal leading-normal dark:text-gray-400">
          {post.publishedDate}
        </p>
      </div>
    </Link>
  );
};

export default PostListItem;