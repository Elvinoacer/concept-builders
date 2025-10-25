'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import { designsPageData } from '@/lib/dummydata/designsPage';
import { Category } from '@/generated/prisma';
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface FilterControlsProps {
  categories: Category[];
  category?: string;
  sort?: string;
  search?: string;
}

export function FilterControls({ categories, category, sort, search }: FilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(search || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) {
      params.set('search', debouncedSearchTerm);
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  }, [debouncedSearchTerm, router, searchParams]);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', value);
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
      <Input
        type="text"
        placeholder="Search designs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-[250px]"
      />
      <Select onValueChange={handleCategoryChange} defaultValue={category || 'All'}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder={designsPageData.categorySelectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">{designsPageData.allCategoriesOption}</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={handleSortChange} defaultValue={sort || 'name'}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={designsPageData.sortBySelectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">{designsPageData.sortByNameOption}</SelectItem>
          <SelectItem value="price-asc">{designsPageData.sortByPriceAscOption}</SelectItem>
          <SelectItem value="price-desc">{designsPageData.sortByPriceDescOption}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
