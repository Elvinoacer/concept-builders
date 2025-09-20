
import { categories } from "@/lib/blog-data";

const Categories = () => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3
        className="text-lg md:text-xl font-bold tracking-tight mb-4"
        style={{
          background: "linear-gradient(to right, #0B2545, #134E4A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Categories
      </h3>
      <ul className="space-y-3">
        {categories.map((category, index) => (
          <li key={index}>
            <a
              className="text-gray-600 hover:text-primary hover:font-medium transition-all text-base dark:text-gray-400 dark:hover:text-primary"
              href="#"
            >
              {category}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
