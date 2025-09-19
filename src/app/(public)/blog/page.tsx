
import BlogHeader from "@/components/blog/BlogHeader";
import FeaturedPost from "@/components/blog/FeaturedPost";
import PostList from "@/components/blog/PostList";
import Sidebar from "@/components/blog/Sidebar";

const BlogPage = () => {
  return (
    <div className="flex-1 px-10 py-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <BlogHeader />
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8">
            <FeaturedPost />
            <PostList />
          </div>
          <aside className="col-span-4 space-y-8">
            <Sidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
