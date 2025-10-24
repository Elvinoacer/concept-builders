import { Design } from "@/generated/prisma";
import DesignCard from "./design-showcase/DesignCard";

interface DesignWithCategoryAndFiles extends Design {
  category: { name: string } | null;
  files: { url: string }[];
}

interface FeaturedDesignsProps {
  featuredDesigns: DesignWithCategoryAndFiles[];
}

const FeaturedDesigns = ({ featuredDesigns }: FeaturedDesignsProps) => {
  if (!featuredDesigns || featuredDesigns.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 dark:text-white">
          Featured Designs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {featuredDesigns.map((design, index) => (
            <DesignCard key={design.id} design={design} index={index} showDetails={false} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDesigns;
