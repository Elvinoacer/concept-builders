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
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  }, [debouncedSearchTerm, router, searchParams]);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", value);
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
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
        className="w-full xs:w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] text-sm h-9 sm:h-10"
      />
      <Select
        onValueChange={handleCategoryChange}
        defaultValue={category || "All"}
      >
        <SelectTrigger className="w-full xs:w-[130px] sm:w-[150px] md:w-[160px] text-sm h-9 sm:h-10">
          <SelectValue
            placeholder={designsPageData.categorySelectPlaceholder}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All" className="text-sm">
            {designsPageData.allCategoriesOption}
          </SelectItem>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.name}
              className="text-sm"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={handleSortChange} defaultValue={sort || "name"}>
        <SelectTrigger className="w-full xs:w-[130px] sm:w-[150px] md:w-[160px] text-sm h-9 sm:h-10">
          <SelectValue placeholder={designsPageData.sortBySelectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name" className="text-sm">
            {designsPageData.sortByNameOption}
          </SelectItem>
          <SelectItem value="price-asc" className="text-sm">
            {designsPageData.sortByPriceAscOption}
          </SelectItem>
          <SelectItem value="price-desc" className="text-sm">
            {designsPageData.sortByPriceDescOption}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
