import { Post } from "@/generated/prisma";
import Image from "next/image";

async function getPopularPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`);
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  const posts = await res.json();
  return posts.slice(0, 3);
}

const PopularPosts = async () => {
  const popularPosts: Post[] = await getPopularPosts();

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg md:text-xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
        Popular Posts
      </h3>
      <div className="space-y-4">
        {popularPosts.map((post, index) => (
          <a
            key={index}
            className="flex items-center gap-4 group"
            href={`/blog/${post.id}`}
          >
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-md h-12 w-12 md:h-16 md:w-16 flex-shrink-0">
              <Image
                src={post.image || ""}
                alt={post.title}
                width={64}
                height={64}
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-gray-800 text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors dark:text-white">
                {post.title}
              </h4>
              <p className="text-gray-500 text-sm font-normal leading-normal mt-1 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;
