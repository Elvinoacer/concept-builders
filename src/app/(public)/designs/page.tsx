import DesignCard from "@/components/DesignCard";
import { designsPageData } from "@/lib/dummydata/designsPage";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { FilterControls } from "@/components/design-showcase/FilterControls";
import { PaginationControls } from "@/components/design-showcase/PaginationControls";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface AllDesignsPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    search?: string;
    page?: string;
    pageSize?: string;
    isFeatured?: string;
  };
}

const AllDesignsPage = async ({ searchParams }: AllDesignsPageProps) => {
  const session = await getServerSession(authOptions);
  const { category, sort, search, isFeatured } = searchParams;

  const currentPage = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 9;
  const skip = (currentPage - 1) * pageSize;

  const categories = await prisma.category.findMany();

  const where: Prisma.DesignWhereInput = {};
  if (category && category !== "All") {
    where.category = {
      name: category,
    };
  }

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (isFeatured === "true") {
    where.isFeatured = true;
  }

  const orderBy: Prisma.DesignOrderByWithRelationInput = {};
  if (sort === "price-asc") {
    orderBy.basePrice = "asc";
  } else if (sort === "price-desc") {
    orderBy.basePrice = "desc";
  } else {
    orderBy.name = "asc";
  }

  const [designs, totalDesigns, user] = await Promise.all([
    prisma.design.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        images: true,
        category: true,
        architecturalDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          },
        },
        structuralDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          },
        },
        billOfQuantities: {
          include: {
            excelFiles: true,
          },
        },
      },
    }),
    prisma.design.count({
      where,
    }),
    session?.user?.id
      ? prisma.user.findUnique({
          where: { id: session.user.id },
          include: { wishlist: true },
        })
      : Promise.resolve(null),
  ]);

  const totalPages = Math.ceil(totalDesigns / pageSize);
  const wishlist = user?.wishlist || [];

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden"
      style={{
        fontFamily: '"Work Sans", "Noto Sans", sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-full mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight dark:text-white">
                {designsPageData.pageTitle}
              </h1>
              <FilterControls
                categories={categories}
                category={category}
                sort={sort}
                search={search}
              />
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {designs.map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  isFavorited={wishlist.some((item) => item.id === design.id)}
                />
              ))}
            </div>

            {designs.length === 0 && (
              <div className="text-center py-12 sm:py-16 md:py-20">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                  🏗️
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No designs found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllDesignsPage;
