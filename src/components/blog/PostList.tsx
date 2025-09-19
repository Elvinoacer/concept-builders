
import { posts } from "@/lib/blog-data";
import PostListItem from "./PostListItem";
import Pagination from "./Pagination";

const PostList = () => {
  return (
    <div>
      <h2
        className="text-2xl font-bold tracking-tight mb-6"
        style={{
          background: "linear-gradient(to right, #0B2545, #134E4A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        All Posts
      </h2>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <PostListItem key={index} post={post} />
        ))}
      </div>
      <Pagination />
    </div>
  );
};

export default PostList;
