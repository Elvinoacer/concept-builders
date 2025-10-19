"use client";
import { useEffect, useState, use } from "react";
import Breadcrumbs from "@/components/design-detail/Breadcrumbs";
import DesignGallery from "@/components/design-detail/DesignGallery";
import DesignHeader from "@/components/design-detail/DesignHeader";
import DesignTabs from "@/components/design-detail/DesignTabs";
import FloorPlan from "@/components/design-detail/FloorPlan";
import PurchaseSidebar from "@/components/design-detail/PurchaseSidebar";
import RelatedDesigns from "@/components/design-detail/RelatedDesigns";
import Renderings from "@/components/design-detail/Renderings";
import { ThemeProvider } from "@/components/theme-provider";
import Loading from './loading';

const DesignDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = use(params);
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const response = await fetch(`/api/designs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch design");
        }
        const data = await response.json();
        setDesign(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDesign();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!design) {
    return <div>Design not found</div>;
  }

  const images = design.files?.filter(file => file.type === 'IMAGE') || [];
  const renderings = design.files?.filter(file => file.type === 'IMAGE') || [];
  const floorPlan = design.files?.find(file => file.type === 'FLOOR_PLAN');

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className="flex-1 px-4 lg:px-8 xl:px-16 py-8 md:py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-8xl mx-auto">
          <div className="mb-6">
            <Breadcrumbs designName={design.name} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DesignHeader
                name={design.name}
                description={design.description}
              />
              <DesignGallery images={images} />
              <Renderings renderings={renderings} />
              {floorPlan && <FloorPlan floorPlanUrl={floorPlan.url} />}
              {design && design.buildingCostEstimates && <DesignTabs design={design} />}
            </div>

            <div className="lg:col-span-1">
              <PurchaseSidebar design={design} />
            </div>
          </div>
          <RelatedDesigns categoryId={design.categoryId} />
        </div>
      </main>
    </ThemeProvider>
  );
};

export default DesignDetailPage;