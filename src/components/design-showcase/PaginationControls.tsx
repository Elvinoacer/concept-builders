"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col xs:flex-row justify-center items-center gap-2 sm:gap-3 mt-6 sm:mt-8">
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="ghost"
        size="sm"
        className="text-xs sm:text-sm h-10 px-4 border border-cb-border bg-surface text-cream-dim hover:bg-gold hover:text-ink disabled:opacity-50 disabled:hover:bg-surface disabled:hover:text-cream-dim transition-all duration-300 font-bold"
      >
        Previous
      </Button>

      <div className="flex items-center gap-1 sm:gap-2">
        {visiblePages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 text-muted text-xs sm:text-sm">
              ...
            </span>
          ) : (
            <Button
              key={index}
              onClick={() => handlePageChange(page as number)}
              variant="ghost"
              size="sm"
              className={`text-xs sm:text-sm h-10 w-10 p-0 transition-all duration-300 font-bold ${
                currentPage === page
                  ? "bg-gold text-ink shadow-lg shadow-gold/20"
                  : "border border-cb-border bg-surface text-cream-dim hover:bg-gold/20 hover:text-gold"
              }`}
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="ghost"
        size="sm"
        className="text-xs sm:text-sm h-10 px-4 border border-cb-border bg-surface text-cream-dim hover:bg-gold hover:text-ink disabled:opacity-50 disabled:hover:bg-surface disabled:hover:text-cream-dim transition-all duration-300 font-bold"
      >
        Next
      </Button>
    </div>
  );
}
