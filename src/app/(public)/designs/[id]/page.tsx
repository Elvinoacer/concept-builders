"use client";
import { Design } from "@/generated/prisma";
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
import ErrorState from "@/components/design-detail/ErrorState";
import NotFoundState from "@/components/design-detail/NotFoundState";

const DesignDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = use(params);
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDesign = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/designs/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setDesign(null);
        } else {
          throw new Error("Failed to fetch design");
        }
      } else {
        const data = await response.json();
        setDesign(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDesign();

      // Track design view
      const trackView = async () => {
        try {
          await fetch(`/api/designs/${id}/view`, {
            method: 'POST',
          });
        } catch (error) {
          console.error('Error tracking design view:', error);
        }
      };
      trackView();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDesign} />;
  }

  if (!design) {
    return <NotFoundState />;
  }

  const images = design.images || [];
  const renderings = design.images || []; // Assuming renderings are the same as images for now
  const floorPlans = design.floorPlans || [];

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
              {floorPlans.map((fp) => <FloorPlan key={fp.id} floorPlanUrl={fp.url} />)}
              {design && <DesignTabs design={design} />}
            </div>

            <div className="lg:col-span-1">
              <PurchaseSidebar design={design} />
            </div>
          </div>
          <RelatedDesigns categoryId={design.categoryId} currentDesignId={design.id} />
        </div>
      </main>
    </ThemeProvider>
  );
};

export default DesignDetailPage;