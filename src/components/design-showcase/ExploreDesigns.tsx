"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
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

type ShowcaseDesign = {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  floors?: number | null;
  views?: number;
  isFeatured?: boolean;
  category?: { id: string; name: string } | null;
  images: Array<{ url: string; name?: string; type: string }>;
  files?: Array<{ url: string; name?: string; type: string }>;
};

const ExploreDesigns = ({ onCardClick }: { onCardClick?: (id: string) => void }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [designs, setDesigns] = useState<ShowcaseDesign[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const initialLoad = useRef(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const priceType = searchParams.get("priceType");
  const sortBy = searchParams.get("sortBy") || "Newest";

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
      transition: { staggerChildren: 0.1 },
    },
  };

  const sortOptions = [
    { value: "Newest", label: "Newest Arrival" },
    { value: "Popular", label: "Most Popular" },
    { value: "Price (Low to High)", label: "Price: Low to High" },
    { value: "Price (High to Low)", label: "Price: High to Low" },
  ];

  // Calculate active filters
  const activeFilters = [];
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const bedrooms = searchParams.get("bedrooms");
  const styles = searchParams.get("styles");
  
  if (minPrice || maxPrice) {
    activeFilters.push({ id: "price", label: `Price: ${minPrice || 0} - ${maxPrice || "Any"}` });
  }
  if (bedrooms) activeFilters.push({ id: "bedrooms", label: `${bedrooms} Beds` });
  if (styles) activeFilters.push({ id: "styles", label: styles });

  const clearFilter = (id: string) => {
    if (id === "price") {
      updateSearchParams({ minPrice: null, maxPrice: null });
    } else {
      updateSearchParams({ [id]: null });
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="rounded-[1.5rem] border border-cb-border bg-[rgba(10,9,7,0.55)] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.2)] sm:p-6 lg:p-8"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-6">
        <div>
          <p className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-7 bg-gold" />
            Full Library
          </p>
          <h2
            className="mb-3 text-[clamp(34px,5vw,58px)] font-light leading-[1.05] text-cream"
            style={{
              fontFamily: 'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            Explore Designs
          </h2>
          <p className="text-sm leading-[1.75] text-cream-dim sm:text-base">
            Discover the full catalog and filter by style, budget, and build
            readiness.
          </p>
        </div>
        
        {/* CONTROLS ROW 1 */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64 lg:w-96">
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60"
              animate={{ rotate: isSearching ? 360 : 0 }}
              transition={{ duration: 1, repeat: isSearching ? Infinity : 0 }}
            >
              <Search className="h-4 w-4" />
            </motion.div>
            <motion.input
              className="w-full rounded-full border border-cb-border bg-[rgba(240,232,216,0.06)] py-3 pl-10 pr-4 text-sm text-cream placeholder:text-muted transition-all duration-300 focus:border-gold focus:ring-0"
              placeholder="Search for designs..."
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              whileFocus={{ scale: 1.02 }}
            />
          </div>

          <div className="relative w-full sm:w-56">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex w-full items-center justify-between rounded-full border border-cb-border bg-[rgba(240,232,216,0.06)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-all hover:border-gold/40 hover:bg-gold/10"
            >
              <span>{sortOptions.find(o => o.value === sortBy)?.label || "Sort"}</span>
              <ChevronDown className="h-4 w-4 text-gold" />
            </button>
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full z-30 mt-2 w-full overflow-hidden rounded-2xl border border-cb-border bg-ink shadow-xl"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        updateSearchParams({ sortBy: option.value });
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-[11px] uppercase tracking-[0.14em] transition-colors ${sortBy === option.value ? "text-gold bg-gold/10" : "text-cream hover:bg-[rgba(240,232,216,0.05)]"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CONTROLS ROW 2 (Pill/Chip filter row) */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-[rgba(240,232,216,0.08)] bg-black/15 p-3">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 rounded-full border px-4 py-3 text-[11px] uppercase tracking-[0.16em] transition-all ${isFilterOpen ? "border-gold bg-gold/15 text-gold" : "border-cb-border bg-[rgba(240,232,216,0.06)] text-gold hover:border-gold/40 hover:bg-gold/10"}`}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
          {activeFilters.length > 0 && (
            <span className="bg-gold text-ink text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center ml-1">
              {activeFilters.length}
            </span>
          )}
        </button>

        {activeFilters.map(filter => (
          <button
            key={filter.id}
            onClick={() => clearFilter(filter.id)}
            className="flex items-center gap-1.5 rounded-full border border-[rgba(200,137,42,0.3)] bg-[rgba(200,137,42,0.08)] px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-gold hover:bg-[rgba(200,137,42,0.15)]"
          >
            {filter.label}
            <X className="h-3 w-3" />
          </button>
        ))}

        {activeFilters.length > 0 && (
          <button
            onClick={handleClearFilters}
            className="ml-2 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-muted hover:bg-white/5 hover:text-cream"
          >
            Clear All
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden rounded-[1.25rem] border border-cb-border bg-[rgba(240,232,216,0.03)]"
          >
            <div className="p-4 sm:p-6 lg:p-8">
              <FilterAside
                key={searchParams.toString()}
                onClose={() => setIsFilterOpen(false)}
                searchParams={searchParams}
                updateSearchParams={updateSearchParams}
                handleClearFilters={handleClearFilters}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="col-span-full">
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start"
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
                style={{ fontFamily: 'var(--font-cormorant-garamond), "Cormorant Garamond", serif' }}
              >
                No designs found
              </h3>
              <p className="mx-auto max-w-md text-sm leading-[1.75] text-cream-dim sm:text-base">
                Try adjusting your filters or search terms to reveal more options.
              </p>
            </motion.div>
          ) : (
            designs.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <DesignCard
                  design={design}
                  index={index}
                  priceType={priceType}
                  onCardClick={onCardClick}
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
                    onClick={(e) => { e.preventDefault(); handlePageChange(Math.max(1, currentPage - 1), true); }}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={(e) => { e.preventDefault(); handlePageChange(i + 1, true); }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(Math.min(totalPages, currentPage + 1), true); }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default ExploreDesigns;
