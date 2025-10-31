"use client";
import Link from "next/link";
import { Category, Design, File } from "@/generated/prisma"; // Import Design and File

interface CategoryWithDesignsAndFiles extends Category {
  designs: (Design & { files: File[]; images: File[] })[];
  _count: { designs: number };
}

interface FeaturedCategoriesProps {
  featuredCategories: CategoryWithDesignsAndFiles[];
}

const FeaturedCategories = ({
  featuredCategories,
}: FeaturedCategoriesProps) => {
  if (!featuredCategories || featuredCategories.length === 0) {
    return null; // Or display a message like "No featured categories available"
  }

  return (
    <section className="py-8 md:py-12 lg:py-16">
      <h2 className="text-slate-800 text-2xl md:text-3xl font-bold tracking-tight mb-6 md:mb-8 dark:text-white">
        Featured Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {featuredCategories.map((category, index) => (
          <Link
            key={category.id || index}
            href={`/design-showcase?category=${category.name}`}
          >
                        <div className="group relative block bg-black rounded-lg overflow-hidden min-h-80">
                          <div
                            className="absolute inset-0 bg-center bg-no-repeat bg-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                            style={{
                              backgroundImage: `url("${category.designs?.[0]?.images?.[0]?.url || category.image || "/images/category-placeholder.png"}")`,
                            }}
                          ></div>
                          <div className="relative flex flex-col justify-end h-full p-4 sm:p-6 lg:p-8 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-white text-lg md:text-xl font-bold">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-300">{category._count.designs} designs</p>
                          </div>
                        </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
