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
  const pageSize = Number(searchParams.pageSize) || 9; // Default page size
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

  if (isFeatured === 'true') {
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
        files: {
          where: {
            type: "IMAGE",
          },
        },
        category: true,
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
        <main className="flex-1 px-4 py-8 md:px-16 lg:px-24 xl:px-40 md:py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight dark:text-white">
                {designsPageData.pageTitle}
              </h1>
              <FilterControls
                categories={categories}
                category={category}
                sort={sort}
                search={search}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {designs.map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  isFavorited={wishlist.some((item) => item.id === design.id)}
                />
              ))}
            </div>
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
