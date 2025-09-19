
import { categories } from "@/lib/designs";

const FeaturedCategories = () => {
  return (
    <section className="py-16">
      <h2 className="text-slate-800 text-3xl font-bold tracking-tight mb-8 dark:text-white">
        Featured Categories
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <div key={index} className="group flex flex-col gap-4">
            <div className="overflow-hidden rounded-lg">
              <div
                className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url("${category.image}")` }}
              ></div>
            </div>
            <div>
              <h3 className="text-slate-800 text-xl font-semibold dark:text-gray-200">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
