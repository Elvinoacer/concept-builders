
import { Input } from "@/components/ui/input";

const BlogHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      <h1
        className="text-3xl md:text-4xl font-bold"
        style={{
          background: "linear-gradient(to right, #0B2545, #134E4A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Blog
      </h1>
      <div className="w-full md:max-w-xs">
        <Input placeholder="Search blog posts" />
      </div>
    </div>
  );
};

export default BlogHeader;
