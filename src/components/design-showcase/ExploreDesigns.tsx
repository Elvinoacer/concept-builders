
'use client';

import { useState } from 'react';
import FilterAside from "./FilterAside";
import DesignCard from "./DesignCard";
import { allDesigns } from "@/lib/design-showcase-data";
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
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allDesigns.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedDesigns = allDesigns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section>
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white shrink-0">Explore All Designs</h2>
        <div className="w-full flex items-center gap-4">
          <div className="relative w-full max-w-lg">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-2xl"> search </span>
            <input className="w-full rounded-full border-transparent bg-white dark:bg-gray-800 py-3 pl-12 pr-6 text-base text-slate-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-primary shadow-sm" placeholder="Search designs (e.g., 'modern', '3-bedroom', 'ranch')" type="search"/>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors shrink-0">
            <span className="material-symbols-outlined text-xl">filter_list</span>
            <span>Filters</span>
          </button>
          <div className="relative">
            <select className="appearance-none w-full rounded-lg border-transparent bg-gray-200 dark:bg-gray-800 py-2.5 pl-4 pr-10 text-sm text-slate-800 dark:text-gray-100 focus:border-primary focus:ring-primary shrink-0">
              <option>Sort by: Newest</option>
              <option>Sort by: Popular</option>
              <option>Sort by: Price (Low to High)</option>
              <option>Sort by: Price (High to Low)</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">expand_more</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-[280px_1fr]">
        <FilterAside />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedDesigns.map((design, index) => (
            <DesignCard key={index} design={design} index={index} />
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
