
'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CgSpinner } from "react-icons/cg";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async () => {
    setIsLoading(true);
    const response = await fetch(
      `/api/categories?search=${searchQuery}&page=${currentPage}&limit=9`
    );
    const data = await response.json();
    setCategories(data.categories);
    setTotalPages(data.totalPages);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchQuery]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Categories</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
            <Input
                placeholder="Search categories..."
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        {isLoading ? (
            <div className="flex items-center justify-center h-24">
                <CgSpinner className="animate-spin text-primary" size={32} />
            </div>
        ) : categories.length === 0 ? (
            <div className="text-center text-muted-foreground">No categories found.</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category: any) => (
                <Link href={`/categories/${category.id}`} key={category.id}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer">
                    <div className="relative h-64">
                    <Image
                        src={category.image || '/images/placeholder.png'}
                        alt={category.name}
                        layout="fill"
                        objectFit="cover"
                    />
                    </div>
                    <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{category.name}</h2>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        )}
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
      </main>
    </div>
  );
}
