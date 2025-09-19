
import Image from "next/image";

const PostListItem = ({ post }) => {
  return (
    <a
      className="flex items-center gap-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-lg"
      href="#"
    >
      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-md h-24 w-24 flex-shrink-0">
        <Image
          src={post.image}
          alt={post.title}
          width={96}
          height={96}
          className="rounded-md"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h4 className="text-gray-800 text-lg font-bold leading-snug line-clamp-2 dark:text-white">
          {post.title}
        </h4>
        <p className="text-gray-500 text-sm font-normal leading-normal mt-1 dark:text-gray-400">
          {post.date}
        </p>
      </div>
    </a>
  );
};

export default PostListItem;
