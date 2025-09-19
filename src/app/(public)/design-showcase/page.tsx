
import FeaturedDesigns from "@/components/design-showcase/FeaturedDesigns";
import ExploreDesigns from "@/components/design-showcase/ExploreDesigns";

const DesignShowcasePage = () => {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 dark:bg-gray-950">
      <FeaturedDesigns />
      <ExploreDesigns />
    </main>
  );
};

export default DesignShowcasePage;
