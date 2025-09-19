
import { Input } from "@/components/ui/input";

const BlogHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1
        className="text-4xl font-bold"
        style={{
          background: "linear-gradient(to right, #0B2545, #134E4A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Blog
      </h1>
      <div className="w-full max-w-xs">
        <Input placeholder="Search blog posts" />
      </div>
    </div>
  );
};

export default BlogHeader;
