
import { Input } from "@/components/ui/input";

const BlogHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-end mb-8 gap-4">
      <div className="w-full md:max-w-xs">
        <Input placeholder="Search blog posts" />
      </div>
    </div>
  );
};

export default BlogHeader;
