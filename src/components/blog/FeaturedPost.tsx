
import { featuredPost } from "@/lib/blog-data";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const FeaturedPost = () => {
  return (
    <div className="p-4 @container bg-white rounded-lg border border-gray-200 shadow-sm mb-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-stretch justify-start rounded-lg @xl:flex-row @xl:items-start">
        <div className="w-full @xl:w-1/2 bg-center bg-no-repeat aspect-video bg-cover rounded-md">
          <Image
            src={featuredPost.image}
            alt={featuredPost.title}
            width={500}
            height={300}
            className="rounded-md"
          />
        </div>
        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 py-4 @xl:pl-6">
          <p
            className="text-sm font-bold leading-normal"
            style={{
              background: "linear-gradient(to right, #0B2545, #134E4A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Featured
          </p>
          <h3 className="text-gray-900 text-xl font-bold leading-tight tracking-tight dark:text-white">
            {featuredPost.title}
          </h3>
          <p className="text-gray-500 text-base font-normal leading-relaxed flex-grow dark:text-gray-400">
            {featuredPost.description}
          </p>
          <Button className="mt-2 max-w-fit">Read More</Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
