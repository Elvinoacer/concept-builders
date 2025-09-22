
import { blogPostsData } from "@/lib/blog-data";
import PostListItem from "./PostListItem";
import Pagination from "./Pagination";

const PostList = () => {
  return (
    <div>
      <h2
        className="text-xl md:text-2xl font-bold tracking-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400"
      >
        All Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPostsData
          .filter((post) => post.status === "Published" && post.image)
          .map((post, index) => (
            <PostListItem key={index} post={post} />
          ))}
      </div>
      <Pagination />
    </div>
  );
};

export default PostList;
