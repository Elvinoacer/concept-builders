'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import FilterAside from "./FilterAside";
import DesignCard from "./DesignCard";
import { designs as allDesigns } from "@/lib/dummydata";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 8;

const ExploreDesigns = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const bedrooms = searchParams.get('bedrooms');
  const styles = searchParams.get('styles');
  const minSize = searchParams.get('minSize');
  const sortBy = searchParams.get('sortBy');

  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateSearchParams = useCallback((name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '') {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams('search', e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams('sortBy', e.target.value);
    setCurrentPage(1); // Reset to first page on new sort
  };

  const handleClearFilters = () => {
    updateSearchParams('minPrice', null);
    updateSearchParams('maxPrice', null);
    updateSearchParams('bedrooms', null);
    updateSearchParams('styles', null);
    updateSearchParams('minSize', null);
    updateSearchParams('search', null); // Also clear search query
    updateSearchParams('sortBy', null); // Also clear sort by
    setCurrentPage(1); // Reset to first page
  };

  const initialDesigns = allDesigns; // Use allDesigns as the base

  const filteredAndSortedDesigns = initialDesigns
    .filter(design => {
      const categoryMatch = category ? design.category === category : true;
      const searchMatch = searchQuery
        ? design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          design.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const minPriceMatch = minPrice ? design.price >= parseInt(minPrice) : true;
      const maxPriceMatch = maxPrice ? design.price <= parseInt(maxPrice) : true;
      const bedroomsMatch = bedrooms && bedrooms !== 'Any' ? (bedrooms === '4+' ? design.bedrooms >= 4 : design.bedrooms === parseInt(bedrooms)) : true;
      const stylesMatch = styles ? styles.split(',').includes(design.style) : true;
      const minSizeMatch = minSize ? design.area >= parseInt(minSize) : true;

      return categoryMatch && searchMatch && minPriceMatch && maxPriceMatch && bedroomsMatch && stylesMatch && minSizeMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Newest':
          return b.id - a.id; // Assuming higher ID means newer
        case 'Popular':
          return Math.random() - 0.5; // Placeholder for popularity
        case 'Price (Low to High)':
          return a.price - b.price;
        case 'Price (High to Low)':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredAndSortedDesigns.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedDesigns = filteredAndSortedDesigns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  return (
    <section ref={sectionRef}>
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white shrink-0 self-start">Explore All Designs</h2>
        <div className="w-full flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-2xl"> search </span>
            <input
              className="w-full rounded-full border-transparent bg-white dark:bg-gray-800 py-3 pl-12 pr-6 text-base text-slate-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-primary shadow-sm"
              placeholder="Search designs..."
              type="search"
              value={searchQuery || ''}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full md:w-auto flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors shrink-0">
              <span className="material-symbols-outlined text-xl">filter_list</span>
              <span>Filters</span>
            </button>
            <div className="relative flex-1">
              <select
                className="appearance-none w-full rounded-lg border-transparent bg-gray-200 dark:bg-gray-800 py-2.5 pl-4 pr-10 text-sm text-slate-800 dark:text-gray-100 focus:border-primary focus:ring-primary shrink-0"
                value={sortBy || 'Newest'}
                onChange={handleSortChange}
              >
                <option>Newest</option>
                <option>Popular</option>
                <option>Price (Low to High)</option>
                <option>Price (High to Low)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-[280px_1fr]">
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <FilterAside key={searchParams.toString()} onClose={() => setIsFilterOpen(false)} searchParams={searchParams} updateSearchParams={updateSearchParams} handleClearFilters={handleClearFilters} />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
          {paginatedDesigns.map((design, index) => (
            <DesignCard key={design.name} design={design} index={index} />
          ))}
        </div>
      </div>
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(Math.max(1, currentPage - 1));
              }}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={currentPage === i + 1}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(Math.min(totalPages, currentPage + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};

export default ExploreDesigns;