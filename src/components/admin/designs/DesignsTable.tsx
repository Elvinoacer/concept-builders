"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DesignsList from "./DesignsList";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

const DesignsTable = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDesigns = async () => {
      if (searchQuery) {
        setIsSearching(true);
      } else if (!searchQuery && designs.length > 0) {
        // don't show loading indicator if search is cleared
      } else {
        setLoading(true);
      }
      try {
        const response = await fetch(
          `/api/designs?search=${searchQuery}&page=${currentPage}&limit=10`
        );
        const data = await response.json();
        setDesigns(data.designs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching designs:", error);
      }
      if (searchQuery) {
        setIsSearching(false);
      } else {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [currentPage, searchQuery]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-md border border-border overflow-hidden"
    >
      <div className="mb-4 p-3 md:mb-6 md:p-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            search
          </span>
          <Input
            className="form-input w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-card"
            placeholder="Search designs"
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2">Searching...</div>}
        </div>
      </div>
      <DesignsList designs={designs} />
      <div className="p-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </motion.div>
  );
};

export default DesignsTable;


