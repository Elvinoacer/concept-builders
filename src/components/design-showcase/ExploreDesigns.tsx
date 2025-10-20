'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import FilterAside from "./FilterAside";

import DesignCard from "./DesignCard";

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

  const [designs, setDesigns] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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
    const params = new URLSearchParams();
    router.push(`${pathname}?${params.toString()}`);
    setCurrentPage(1); // Reset to first page
  };

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', currentPage.toString());
      params.set('limit', ITEMS_PER_PAGE.toString());

      try {
        const response = await fetch(`/api/designs?${params.toString()}`);
        const data = await response.json();
        setDesigns(data.designs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching designs:', error);
      }
      setLoading(false);
    };

    fetchDesigns();
  }, [searchParams, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  return (
    <section ref={sectionRef}>
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white shrink-0 self-start">Explore Designs</h2>
        <div className="w-full flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-2xl"> search </span>
            <input
              className="w-full rounded-full border-transparent bg-white dark:bg-gray-800 py-3 pl-12 pr-6 text-base text-slate-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-primary shadow-sm"
              placeholder="Search for designs..."
              type="search"
              value={searchParams.get('search') || ''}
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
                value={searchParams.get('sortBy') || 'Newest'}
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            designs.map((design, index) => (
              <DesignCard key={design.id} design={design} index={index} />
            ))
          )}
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