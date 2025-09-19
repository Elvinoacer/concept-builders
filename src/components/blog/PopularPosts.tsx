
import { popularPosts } from "@/lib/blog-data";
import Image from "next/image";

const PopularPosts = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3
        className="text-xl font-bold tracking-tight mb-4"
        style={{
          background: "linear-gradient(to right, #0B2545, #134E4A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Popular Posts
      </h3>
      <div className="space-y-4">
        {popularPosts.map((post, index) => (
          <a key={index} className="flex items-center gap-4 group" href="#">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-md h-16 w-16 flex-shrink-0">
              <Image
                src={post.image}
                alt={post.title}
                width={64}
                height={64}
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-gray-800 text-base font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors dark:text-white">
                {post.title}
              </h4>
              <p className="text-gray-500 text-sm font-normal leading-normal mt-1 dark:text-gray-400">
                {post.date}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;
