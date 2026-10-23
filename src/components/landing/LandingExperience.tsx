"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import DreamPlan from "./hero";
import Featured from "./Featured";
import Explorer from "./Explorer";
import {
  CINEMATIC_HOME,
  EDITORIAL_HOMES,
  toLandingPlan,
  type LandingDesign,
  type LandingPlan,
  type PreviewHandler,
} from "@/lib/landing-designs";
import "./LandingExperience.css";

const DesignModal = dynamic(() => import("./DesignModal"), { ssr: false });

type LandingCatalog = {
  featuredDesigns: LandingDesign[];
  allDesigns: LandingDesign[];
  cinematicDesign: LandingDesign | null;
  totalDesignCount: number;
};
const CatalogContext = createContext<
  ((catalog: LandingCatalog) => void) | null
>(null);

// Stream catalog data into the existing interactive shell without replacing it.
// An open preview or a visitor's scroll position survives a slow database reply.
export function LandingCatalogData({ catalog }: { catalog: LandingCatalog }) {
  const install = useContext(CatalogContext);
  useEffect(() => {
    if (
      catalog.allDesigns.length ||
      catalog.featuredDesigns.length ||
      catalog.cinematicDesign
    )
      install?.(catalog);
  }, [catalog, install]);
  return null;
}

export default function LandingExperience({
  children,
  ...initialCatalog
}: LandingCatalog & { children?: ReactNode }) {
  const [incoming, setIncoming] = useState<LandingCatalog | null>(null);
  const { featuredDesigns, allDesigns, cinematicDesign, totalDesignCount } =
    incoming ?? initialCatalog;
  const [preview, setPreview] = useState<{
    plan: LandingPlan;
    collection: LandingPlan[];
  } | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const featured = useMemo(() => {
    const plans = featuredDesigns
      .map(toLandingPlan)
      .filter((p): p is LandingPlan => p !== null);
    return plans.length ? plans : EDITORIAL_HOMES;
  }, [featuredDesigns]);
  const all = useMemo(() => {
    const plans = allDesigns
      .map(toLandingPlan)
      .filter((p): p is LandingPlan => p !== null);
    return plans.length ? plans : featured;
  }, [allDesigns, featured]);
  const heroHomes = useMemo(() => {
    const cinematic = cinematicDesign && toLandingPlan(cinematicDesign);
    // The atmospheric slideshow uses curated exteriors. The catalog's first
    // thumbnail can be a roof view or a drawing and remains in the library.
    const lead = cinematic
      ? { ...cinematic, images: CINEMATIC_HOME.images }
      : CINEMATIC_HOME;
    return [lead, ...EDITORIAL_HOMES];
  }, [cinematicDesign]);
  const openPreview = useCallback<PreviewHandler>((plan, collection) => {
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setPreview({ plan, collection });
  }, []);
  const closePreview = useCallback(() => setPreview(null), []);
  const restoreFocus = useCallback(() => {
    const target = openerRef.current?.isConnected
      ? openerRef.current
      : document.querySelector<HTMLElement>(".film-hero__preview");
    target?.focus({ preventScroll: true });
  }, []);

  return (
    <CatalogContext.Provider value={setIncoming}>
      <div className="landing-experience" data-preview-open={preview !== null}>
        <DreamPlan
          plan={heroHomes[0]}
          collection={heroHomes}
          onPreview={openPreview}
          paused={preview !== null}
        />
        <Featured plans={featured} onPreview={openPreview} />
        <Explorer
          plans={all}
          totalDesignCount={totalDesignCount}
          onPreview={openPreview}
        />
        {preview && (
          <DesignModal
            plan={preview.plan}
            collection={preview.collection}
            onSelect={(plan) =>
              setPreview((current) => current && { ...current, plan })
            }
            onClose={closePreview}
            onRestoreFocus={restoreFocus}
          />
        )}
        {children}
      </div>
    </CatalogContext.Provider>
  );
}
