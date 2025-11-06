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
        variant="outline"
        size="sm"
        className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 min-w-[60px] sm:min-w-[70px]"
      >
        Previous
      </Button>

      <div className="flex items-center gap-1 sm:gap-2">
        {visiblePages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 text-gray-500 text-xs sm:text-sm">
              ...
            </span>
          ) : (
            <Button
              key={index}
              onClick={() => handlePageChange(page as number)}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="text-xs sm:text-sm h-8 sm:h-9 w-8 sm:w-9 p-0 min-w-0"
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
        className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 min-w-[60px] sm:min-w-[70px]"
      >
        Next
      </Button>
    </div>
  );
}
