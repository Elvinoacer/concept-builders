
import Link from "next/link";
import { blogPosts } from "@/lib/data";

const BlogSection = () => {
  return (
    <section className="py-12 md:py-16">
      <h2 className="text-slate-800 text-2xl md:text-3xl font-bold tracking-tight mb-12 dark:text-white">
        From Our Blog
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {blogPosts.map((post, index) => (
          <div key={index} className="group flex flex-col md:flex-row items-center gap-6 rounded-lg">
            <div className="w-full md:w-1/3 flex-shrink-0 overflow-hidden rounded-lg">
              <div
                className="w-full bg-center bg-no-repeat aspect-video md:aspect-square bg-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url("${post.imageUrl}")` }}
              ></div>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-slate-800 text-xl font-semibold leading-tight group-hover:text-[#1193d4] transition-colors dark:text-gray-200 dark:group-hover:text-primary">
                {post.title}
              </h3>
              <p className="text-slate-500 text-base dark:text-gray-400">{post.description}</p>
              <Link
                className="text-base font-semibold flex items-center gap-2 group bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text"
                href={post.link}
              >
                Read More
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
