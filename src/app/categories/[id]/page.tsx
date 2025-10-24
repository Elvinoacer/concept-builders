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

interface Design {
  id: string;
  name: string;
  description: string;
  files: { url: string; type: string }[];
  isFeatured: boolean;
  reviews: any[];
  discounts: any[];
  basePrice: number;
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

async function getCategory(id: string, page: number = 1, search: string = "") {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${id}?page=${page}&search=${search}`
    );
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const search = searchParams.search || "";
  const category = await getCategory(params.id, page, search);
  const totalPages = category ? Math.ceil(category._count.designs / 10) : 0;

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
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
            {category.name} Designs
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {category.description}
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
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
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
