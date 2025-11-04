"use client";

import DesignCard from "@/components/design-showcase/DesignCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { FiAlertTriangle } from "react-icons/fi";
import { useEffect, useState } from "react";
import Image from "next/image"; // Ensure this import is from "next/image" and not conflicting with the browser's native Image object

interface Design {
  id: string;
  name: string;
  description: string;
  images: { url: string; type: string }[];
  isFeatured: boolean;
  reviews: any[];
  discounts: any[];
  basePrice: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  designs: Design[];
  image?: string; // Add the image property to the Category interface
  _count: {
    designs: number;
  };
}

interface CategoryPageProps {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const search = searchParams.search || "";

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${params.id}?page=${page}&search=${search}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch category");
        }
        const data = await res.json();
        setCategory(data);
      } catch (error) {
        setError("Failed to load category. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getCategory();
  }, [params.id, page, search]);

  const totalPages = category ? Math.ceil(category._count.designs / 10) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100 dark:bg-gray-900 text-center px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
            <FiAlertTriangle
              size={40}
              className="text-red-500 dark:text-red-400"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
            An Error Occurred
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{error}</p>
          <Link
            href="/categories"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-md"
          >
            Explore Other Categories
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100 dark:bg-gray-900 text-center px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
            <FiAlertTriangle
              size={40}
              className="text-red-500 dark:text-red-400"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
            Category Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The category you are looking for does not exist or may have been
            moved.
          </p>
          <Link
            href="/categories"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-md"
          >
            Explore Other Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <header className="relative h-64 rounded-b-2xl flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src={category.image || "/images/banner-2.png"}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative z-10">
                  <h1 className="text-4xl md:text-5xl font-bold">{category.name} Designs</h1>
                </div>
      </header>
      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="search"
              name="search"
              id="search"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-full px-6 py-4"
              placeholder={`Search in ${category.name}...`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-600 dark:text-gray-300">
              {category._count.designs} designs
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.designs.length === 0 ? (
            <div className="text-center text-muted-foreground col-span-3">
              <p>No designs found in this category.</p>
            </div>
          ) : (
            category.designs.map((design: Design, index: number) => (
              <DesignCard key={design.id} design={design} index={index} />
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Link href={`/categories/${params.id}?page=1`}>
                    <PaginationFirst
                      aria-disabled={page === 1}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                    />
                  </Link>
                </PaginationItem>
                <PaginationItem>
                  <Link href={`/categories/${params.id}?page=${page - 1}`}>
                    <PaginationPrevious
                      aria-disabled={page === 1}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                    />
                  </Link>
                </PaginationItem>
                {getPaginationRange(page, totalPages).map((p, index) => {
                  if (p === "...") {
                    return (
                      <PaginationItem key={index}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={p}>
                      <Link href={`/categories/${params.id}?page=${p}`}>
                        <PaginationLink isActive={page === p}>
                          {p}
                        </PaginationLink>
                      </Link>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <Link href={`/categories/${params.id}?page=${page + 1}`}>
                    <PaginationNext
                      aria-disabled={page === totalPages}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                    />
                  </Link>
                </PaginationItem>
                <PaginationItem>
                  <Link href={`/categories/${params.id}?page=${totalPages}`}>
                    <PaginationLast
                      aria-disabled={page === totalPages}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                    />
                  </Link>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}

function getPaginationRange(currentPage: number, totalPages: number) {
  const delta = 2;
  const range = [];
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    range.unshift("...");
  }
  if (currentPage + delta < totalPages - 1) {
    range.push("...");
  }

  range.unshift(1);
  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
}
