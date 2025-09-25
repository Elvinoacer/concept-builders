import { categories } from "@/lib/dummydata";
import Link from "next/link";

const FeaturedCategories = () => {
  return (
    <section className="py-8 md:py-12 lg:py-16">
      <h2 className="text-slate-800 text-2xl md:text-3xl font-bold tracking-tight mb-6 md:mb-8 dark:text-white">
        Featured Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {categories.map((category, index) => (
          <Link key={index} href={`/design-showcase?category=${category.name}`}>
            <div className="group flex flex-col gap-3 md:gap-4">
              <div className="overflow-hidden rounded-lg">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url("${category.image}")` }}
                ></div>
              </div>
              <div>
                <h3 className="text-slate-800 text-base md:text-lg lg:text-xl font-semibold dark:text-gray-200 text-center md:text-left">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;