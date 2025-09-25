import Breadcrumbs from '@/components/design-detail/Breadcrumbs';
import DesignGallery from '@/components/design-detail/DesignGallery';
import DesignHeader from '@/components/design-detail/DesignHeader';
import DesignTabs from '@/components/design-detail/DesignTabs';
import FloorPlan from '@/components/design-detail/FloorPlan';
import PurchaseSidebar from '@/components/design-detail/PurchaseSidebar';
import RelatedDesigns from '@/components/design-detail/RelatedDesigns';
import Renderings from '@/components/design-detail/Renderings';
import { design } from '@/lib/dummydata';
import { ThemeProvider } from '@/components/theme-provider';

const DesignDetailPage = () => {
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
              <DesignHeader name={design.name} description={design.description} />
              <DesignGallery images={design.images} />
              <Renderings renderings={design.renderings} />
              <FloorPlan floorPlanUrl={design.floorPlanUrl} />
              <DesignTabs design={design} />
            </div>

            <div className="lg:col-span-1">
              <PurchaseSidebar design={design} />
            </div>
          </div>
          <RelatedDesigns relatedDesigns={design.relatedDesigns} />
        </div>
      </main>
    </ThemeProvider>
  );
};

export default DesignDetailPage;