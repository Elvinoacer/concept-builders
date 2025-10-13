
'use client';

import { categories } from "@/lib/dummydata";

const Categories = () => {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm md:p-6">
      <h3 className="font-heading mb-4 text-lg font-bold tracking-tight text-foreground">
        Categories
      </h3>
      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li key={index}>
            <a
              className="text-muted-foreground transition-colors hover:text-primary"
              href="#"
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const CategoriesSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm md:p-6">
      <div className="mb-4 h-6 w-3/4 animate-pulse rounded-md bg-muted"></div>
      <ul className="space-y-3">
        <li className="h-5 w-1/2 animate-pulse rounded-md bg-muted"></li>
        <li className="h-5 w-2/3 animate-pulse rounded-md bg-muted"></li>
        <li className="h-5 w-1/2 animate-pulse rounded-md bg-muted"></li>
        <li className="h-5 w-3/4 animate-pulse rounded-md bg-muted"></li>
      </ul>
    </div>
  );
};

export default Categories;
