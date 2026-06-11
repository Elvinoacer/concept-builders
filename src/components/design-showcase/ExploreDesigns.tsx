// ExploreDesigns.tsx - Enhanced with better UX
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
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
    searchParams.get("search") || "",
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
    [searchParams, router, pathname],
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
      className="border border-cb-border bg-[rgba(10,9,7,0.45)] p-4 sm:p-6 lg:p-8"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <p className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-7 bg-gold" />
            Full Library
          </p>
          <h2
            className="mb-3 text-[clamp(34px,5vw,58px)] font-light leading-[1.05] text-cream"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            Explore Designs
          </h2>
          <p className="text-sm leading-[1.75] text-cream-dim sm:text-base">
            Discover the full catalog and filter by style, budget, and build
            readiness.
          </p>
        </div>
        <div className="w-full lg:w-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full lg:w-96">
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60"
              animate={{ rotate: isSearching ? 360 : 0 }}
              transition={{ duration: 1, repeat: isSearching ? Infinity : 0 }}
            >
              <Search className="h-5 w-5" />
            </motion.div>
            <motion.input
              className="w-full border border-cb-border bg-[rgba(240,232,216,0.05)] py-4 pl-12 pr-6 text-base text-cream placeholder:text-muted focus:border-gold focus:ring-0 transition-all duration-300"
              placeholder="Search for designs..."
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div className="w-full lg:w-auto flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-3 border border-cb-border bg-[rgba(240,232,216,0.05)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-gold transition-all duration-500 hover:border-gold/35"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </motion.button>
            <div className="relative flex-1 lg:w-64">
              <motion.select
                className="appearance-none w-full border border-cb-border bg-[rgba(240,232,216,0.05)] py-4 pl-5 pr-12 text-sm text-cream font-semibold cursor-pointer focus:border-gold focus:ring-0 transition-all duration-300 uppercase tracking-[0.14em]"
                value={searchParams.get("sortBy") || "Newest"}
                onChange={handleSortChange}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="Newest" className="bg-ink">Newest Arrival</option>
                <option value="Popular" className="bg-ink">Most Popular</option>
                <option value="Price (Low to High)" className="bg-ink">Price: Low to High</option>
                <option value="Price (High to Low)" className="bg-ink">Price: High to Low</option>
              </motion.select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gold pointer-events-none h-5 w-5" />
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
                className="col-span-full text-center py-20 sm:py-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-7xl sm:text-9xl mb-6 opacity-20">🏛️</div>
                <h3
                  className="mb-4 text-2xl font-light text-cream sm:text-3xl"
                  style={{
                    fontFamily:
                      'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                  }}
                >
                  No designs found
                </h3>
                <p className="mx-auto max-w-md text-sm leading-[1.75] text-cream-dim sm:text-base">
                  Try adjusting your filters or search terms to reveal more
                  options.
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
                          true,
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
