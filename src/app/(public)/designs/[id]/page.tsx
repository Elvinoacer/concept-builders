import { DesignHeader } from "@/components/design-detail/DesignHeader";
import { DesignGallery } from "@/components/design-detail/DesignGallery";
import { DesignDetails } from "@/components/design-detail/DesignDetails";
import { PurchaseSidebar } from "@/components/design-detail/PurchaseSidebar";
import { RelatedDesigns } from "@/components/design-detail/RelatedDesigns";
import { designDetailData } from "@/lib/design-detail-data";
import Link from "next/link";

export default function DesignDetailPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-gray-950 group/design-root overflow-x-hidden">
      
      <main className="flex-1 px-4 lg:px-8 xl:px-16 py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-8xl mx-auto">
          <div className="mb-6">
            <nav aria-label="Breadcrumb" className="text-sm">
              <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                  <Link className="text-gray-500 dark:text-gray-400 hover:text-[var(--primary-color)] transition-colors" href="/designs">
                    Designs
                  </Link>
                  <span className="material-symbols-outlined mx-2 text-gray-400 dark:text-gray-500">chevron_right</span>
                </li>
                <li className="flex items-center">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{designDetailData.name}</span>
                </li>
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{designDetailData.name}</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-3xl">{designDetailData.description}</p>
              </div>
              <DesignGallery images={designDetailData.images} renderings={designDetailData.renderings} floorPlan={designDetailData.floorPlan} />
              <DesignDetails
                description={designDetailData.description}
                planDetails={designDetailData.planDetails}
                costBreakdown={designDetailData.costBreakdown.standard}
                totalEstimatedCost={designDetailData.totalEstimatedCost.standard}
                faq={designDetailData.faq}
                drawingSets={designDetailData.drawingSets}
                reviews={designDetailData.reviews}
              />
            </div>
            <PurchaseSidebar
              costBreakdown={designDetailData.costBreakdown}
              totalEstimatedCost={designDetailData.totalEstimatedCost}
              designCostBreakdown={designDetailData.designCostBreakdown}
              totalDesignCost={designDetailData.totalDesignCost}
            />
          </div>
          <RelatedDesigns relatedDesigns={designDetailData.relatedDesigns} />
        </div>
      </main>
    </div>
  );
}