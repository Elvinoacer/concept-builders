"use client";
import DesignCard from "@/components/DesignCard";
import { designs } from "@/lib/designs";
import { categories } from "@/lib/categories";
import { useEffect, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AllDesignsPage = () => {
  const [filteredDesigns, setFilteredDesigns] = useState(designs);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("name");

  useEffect(() => {
    let newFilteredDesigns = [...designs];

    if (selectedCategory !== "All") {
      newFilteredDesigns = newFilteredDesigns.filter((design) => design.category === selectedCategory);
    }

    if (sortOrder === "price-asc") {
      newFilteredDesigns.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      newFilteredDesigns.sort((a, b) => b.price - a.price);
    } else {
      newFilteredDesigns.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredDesigns(newFilteredDesigns);
  }, [selectedCategory, sortOrder]);

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden"
      style={{
        fontFamily: '"Work Sans", "Noto Sans", sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-4 py-8 md:px-16 lg:px-24 xl:px-40 md:py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight dark:text-white">All Designs</h1>
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="price-asc">Sort by Price (Low to High)</SelectItem>
                    <SelectItem value="price-desc">Sort by Price (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDesigns.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllDesignsPage;
