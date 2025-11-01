// ExploreDesigns.tsx - Enhanced with better UX
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useDebounce } from "@/hooks/useDebounce";
import DesignCardSkeleton from "./DesignCardSkeleton";

const ITEMS_PER_PAGE = 8;

const ExploreDesigns = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [designs, setDesigns] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const initialLoad = useRef(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const priceType = searchParams.get("priceType");

  const updateSearchParams = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (Object.keys(newParams).length === 0) {
        router.replace(`${pathname}`);
        return;
      }

      for (const [name, value] of Object.entries(newParams)) {
        if (value === null || value === "") {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    updateSearchParams({ search: debouncedSearchTerm });
    setCurrentPage(1);
  }, [debouncedSearchTerm, updateSearchParams]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({ sortBy: e.target.value });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    router.replace(`${pathname}`);
    setCurrentPage(1);
    setSearchTerm("");
  };

  useEffect(() => {
    const fetchDesigns = async () => {
      if (initialLoad.current) {
        setLoading(true);
      } else {
        setIsSearching(true);
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", currentPage.toString());
      params.set("limit", ITEMS_PER_PAGE.toString());
      params.set("search", debouncedSearchTerm);

      try {
        const response = await fetch(`/api/designs?${params.toString()}`);
        const data = await response.json();
        setDesigns(data.designs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching designs:", error);
      }
      setLoading(false);
      setIsSearching(false);
      initialLoad.current = false;
    };

    fetchDesigns();
  }, [searchParams, currentPage, debouncedSearchTerm]);

  const handlePageChange = (page: number, scroll: boolean = false) => {
    setCurrentPage(page);
    if (scroll && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sectionRef = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Explore Designs
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover our complete collection of architectural designs
          </p>
        </div>
        <div className="w-full lg:w-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full lg:w-80">
            <motion.span
              className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-2xl"
              animate={{ rotate: isSearching ? 360 : 0 }}
              transition={{ duration: 1, repeat: isSearching ? Infinity : 0 }}
            >
              search
            </motion.span>
            <motion.input
              className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-3.5 pl-12 pr-6 text-base text-slate-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-lg"
              placeholder="Search for designs..."
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div className="w-full lg:w-auto flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 px-5 py-3.5 text-sm font-medium text-slate-800 dark:text-gray-300 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 shadow-lg"
            >
              <span className="material-symbols-outlined text-xl">
                filter_list
              </span>
              <span>Filters</span>
            </motion.button>
            <div className="relative flex-1 lg:w-48">
              <motion.select
                className="appearance-none w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-3.5 pl-4 pr-10 text-sm text-slate-800 dark:text-gray-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-lg"
                value={searchParams.get("sortBy") || "Newest"}
                onChange={handleSortChange}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="Newest">Newest</option>
                <option value="Popular">Popular</option>
                <option value="Price (Low to High)">Price (Low to High)</option>
                <option value="Price (High to Low)">Price (High to Low)</option>
              </motion.select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-[300px_1fr]">
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="md:block"
            >
              <FilterAside
                key={searchParams.toString()}
                onClose={() => setIsFilterOpen(false)}
                searchParams={searchParams}
                updateSearchParams={updateSearchParams}
                handleClearFilters={handleClearFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`${isFilterOpen ? "hidden md:block" : "col-span-full"}`}
        >
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={currentPage}
          >
            {loading ? (
              [...Array(ITEMS_PER_PAGE)].map((_, index) => (
                <DesignCardSkeleton key={index} index={index} />
              ))
            ) : designs.length === 0 ? (
              <motion.div
                className="col-span-full text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">🏛️</div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No designs found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Try adjusting your search criteria or filters
                </p>
              </motion.div>
            ) : (
              designs.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <DesignCard
                    design={design}
                    index={index}
                    priceType={priceType}
                  />
                </motion.div>
              ))
            )}
          </motion.div>

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Pagination className="mt-12">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.max(1, currentPage - 1), true);
                      }}
                      className="hover:bg-primary/10 transition-colors duration-300"
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1, true);
                        }}
                        className="hover:bg-primary/10 transition-colors duration-300"
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
                        handlePageChange(
                          Math.min(totalPages, currentPage + 1),
                          true
                        );
                      }}
                      className="hover:bg-primary/10 transition-colors duration-300"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default ExploreDesigns;
