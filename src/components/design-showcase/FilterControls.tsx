"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { designsPageData } from "@/lib/dummydata/designsPage";
import { Category } from "@/generated/prisma";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface FilterControlsProps {
  categories: Category[];
  category?: string;
  sort?: string;
  search?: string;
}

export function FilterControls({
  categories,
  category,
  sort,
  search,
}: FilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(search || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  }, [debouncedSearchTerm, router, searchParams]);

  const handleCategoryChange = (value: string) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", value);
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4 w-full">
      <Input
        type="text"
        placeholder="Search designs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full h-12 xs:w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] text-sm border-2 border-cb-border bg-surface text-cream placeholder:text-muted rounded-xl focus:border-gold focus:ring-0 shadow-xl transition-all font-medium"
      />
      <Select
        onValueChange={handleCategoryChange}
        defaultValue={category || "All"}
      >
        <SelectTrigger className="w-full h-12 xs:w-[140px] sm:w-[180px] md:w-[200px] text-sm border-2 border-cb-border bg-surface text-cream focus:ring-0 focus:border-gold rounded-xl shadow-xl transition-all font-bold">
          <SelectValue
            placeholder={designsPageData.categorySelectPlaceholder}
          />
        </SelectTrigger>
        <SelectContent className="bg-card border-2 border-cb-border text-cream rounded-xl shadow-2xl">
          <SelectItem value="All" className="text-sm focus:bg-gold focus:text-ink cursor-pointer py-3 font-bold uppercase tracking-widest">
            {designsPageData.allCategoriesOption}
          </SelectItem>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.name}
              className="text-sm focus:bg-gold focus:text-ink cursor-pointer py-3 font-bold uppercase tracking-widest"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={handleSortChange} defaultValue={sort || "name"}>
        <SelectTrigger className="w-full h-12 xs:w-[140px] sm:w-[180px] md:w-[200px] text-sm border-2 border-cb-border bg-surface text-cream focus:ring-0 focus:border-gold rounded-xl shadow-xl transition-all font-bold">
          <SelectValue placeholder={designsPageData.sortBySelectPlaceholder} />
        </SelectTrigger>
        <SelectContent className="bg-card border-2 border-cb-border text-cream rounded-xl shadow-2xl">
          <SelectItem value="name" className="text-sm focus:bg-gold focus:text-ink cursor-pointer py-3 font-bold uppercase tracking-widest">
            {designsPageData.sortByNameOption}
          </SelectItem>
          <SelectItem value="price-asc" className="text-sm focus:bg-gold focus:text-ink cursor-pointer py-3 font-bold uppercase tracking-widest">
            {designsPageData.sortByPriceAscOption}
          </SelectItem>
          <SelectItem value="price-desc" className="text-sm focus:bg-gold focus:text-ink cursor-pointer py-3 font-bold uppercase tracking-widest">
            {designsPageData.sortByPriceDescOption}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
