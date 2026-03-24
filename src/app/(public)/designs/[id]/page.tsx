"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Bath,
  Bed,
  Building2,
  Calculator,
  Clock3,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  Heart,
  House,
  Layers,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

import { DesignViewTracker } from "@/components/design-detail/DesignViewTracker";
import { useCart } from "@/hooks/useCart";
import Loading from "./loading";

type FileAsset = {
  id: string;
  url: string | null;
  name: string;
  type: string;
};

type PackageOption = {
  id: string;
  name: string;
  description: string | null;
  price: number;
};

type DesignDoc = {
  pdfFiles?: FileAsset[];
  cadFiles?: FileAsset[];
  excelFiles?: FileAsset[];
};

type FAQItem = {
  question: string;
  answer: string;
};

type DesignDetail = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  floors: number | null;
  views: number;
  categoryId: string | null;
  category?: { id: string; name: string } | null;
  planDetails: string[];
  isFeatured: boolean;
  images: FileAsset[];
  floorPlans: FileAsset[];
  packageOptions: PackageOption[];
  faq: unknown;
  architecturalPdfPrice: number | null;
  architecturalCadPrice: number | null;
  structuralPdfPrice: number | null;
  structuralCadPrice: number | null;
  billOfQuantitiesPrice: number | null;
  billOfQuantitiesPdfPrice: number | null;
  architecturalDesign?: DesignDoc | null;
  structuralDesign?: DesignDoc | null;
  billOfQuantities?: DesignDoc | null;
};

type RelatedDesign = {
  id: string;
  name: string;
  basePrice: number;
  category?: { name: string } | null;
  images?: FileAsset[];
};

type ActiveTab = "details" | "floorplans" | "specs" | "faq";

function asFAQ(value: unknown): FAQItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item !== "object" || item === null) return null;
      const q = (item as { question?: unknown }).question;
      const a = (item as { answer?: unknown }).answer;
      if (typeof q !== "string" || typeof a !== "string") return null;
      return { question: q, answer: a };
    })
    .filter((item): item is FAQItem => item !== null);
}

function priceLabel(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function DesignDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useSession();
  const { addToCart } = useCart();

  const [design, setDesign] = useState<DesignDetail | null>(null);
  const [related, setRelated] = useState<RelatedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [heroIndex, setHeroIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const [activeTab, setActiveTab] = useState<ActiveTab>("details");
  const [activeFloorPlan, setActiveFloorPlan] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [wishlisted, setWishlisted] = useState(false);

  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);
  const [exchangeRate, setExchangeRate] = useState(130);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const designId = params?.id;

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!designId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/designs/${designId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Design not found");
          }
          throw new Error("Unable to load design");
        }

        const data = (await response.json()) as DesignDetail;
        if (!mounted) return;

        setDesign(data);
        setHeroIndex(0);
        setGalleryIndex(0);
        setActiveFloorPlan(0);
        setSelectedFileTypes(
          (data.architecturalDesign?.pdfFiles?.length || 0) > 0
            ? ["architecturalPdf"]
            : [],
        );

        if (data.categoryId) {
          const relatedResponse = await fetch(
            `/api/designs?categoryId=${data.categoryId}&limit=3&exclude=${data.id}`,
          );
          if (relatedResponse.ok) {
            const relatedData = (await relatedResponse.json()) as {
              designs?: RelatedDesign[];
            };
            if (mounted) {
              setRelated(relatedData.designs || []);
            }
          }
        }
      } catch (err) {
        if (!mounted) return;
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void fetchData();
    return () => {
      mounted = false;
    };
  }, [designId]);

  useEffect(() => {
    const onScroll = () => {
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const value = total > 0 ? window.scrollY / total : 0;
      setProgress(Math.min(1, Math.max(0, value)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD",
        );
        if (!response.ok) return;
        const data = (await response.json()) as {
          rates?: Record<string, number>;
        };
        if (typeof data.rates?.KES === "number") {
          setExchangeRate(data.rates.KES);
        }
      } catch {
        // Keep fallback rate
      }
    };
    void fetchRate();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!design) return;
      const media = design.images;
      if (!lightboxOpen || media.length === 0) return;
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev - 1 + media.length) % media.length);
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev + 1) % media.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [design, lightboxOpen]);

  const faqItems = useMemo(() => asFAQ(design?.faq), [design?.faq]);

  const documentOptions = useMemo(() => {
    if (!design)
      return [] as Array<{
        key: string;
        label: string;
        description: string;
        availability: boolean;
        locked: boolean;
        price: number;
        category: "architectural" | "structural" | "additional";
      }>;

    return [
      {
        key: "architecturalPdf",
        label: "Architectural PDF",
        description: "Detailed PDF blueprints and plans",
        availability: (design.architecturalDesign?.pdfFiles?.length || 0) > 0,
        locked: true,
        price: design.architecturalPdfPrice || 0,
        category: "architectural" as const,
      },
      {
        key: "architecturalCad",
        label: "Architectural CAD",
        description: "Editable CAD files for modifications",
        availability: (design.architecturalDesign?.cadFiles?.length || 0) > 0,
        locked: false,
        price: design.architecturalCadPrice || 0,
        category: "architectural" as const,
      },
      {
        key: "structuralPdf",
        label: "Structural PDF",
        description: "Structural engineering drawings",
        availability: (design.structuralDesign?.pdfFiles?.length || 0) > 0,
        locked: false,
        price: design.structuralPdfPrice || 0,
        category: "structural" as const,
      },
      {
        key: "structuralCad",
        label: "Structural CAD",
        description: "Structural CAD files for engineers",
        availability: (design.structuralDesign?.cadFiles?.length || 0) > 0,
        locked: false,
        price: design.structuralCadPrice || 0,
        category: "structural" as const,
      },
      {
        key: "billOfQuantitiesExcel",
        label: "Bill of Quantities (Excel)",
        description: "Material and cost breakdown in Excel",
        availability: (design.billOfQuantities?.excelFiles?.length || 0) > 0,
        locked: false,
        price: design.billOfQuantitiesPrice || 0,
        category: "additional" as const,
      },
      {
        key: "billOfQuantitiesPdf",
        label: "Bill of Quantities (PDF)",
        description: "Material and cost breakdown in PDF",
        availability: (design.billOfQuantities?.pdfFiles?.length || 0) > 0,
        locked: false,
        price: design.billOfQuantitiesPdfPrice || 0,
        category: "additional" as const,
      },
    ];
  }, [design]);

  const selectedExtras = useMemo(() => {
    if (!design) return [];
    return design.packageOptions.filter((option) =>
      selectedExtraIds.includes(option.id),
    );
  }, [design, selectedExtraIds]);

  const selectedDocumentExtras = useMemo(
    () =>
      documentOptions.filter(
        (item) => selectedFileTypes.includes(item.key) && !item.locked,
      ),
    [documentOptions, selectedFileTypes],
  );

  const totalPrice = useMemo(() => {
    if (!design) return 0;
    const docsPrice = selectedDocumentExtras.reduce(
      (sum, item) => sum + item.price,
      0,
    );
    const addons = selectedExtras.reduce((sum, item) => sum + item.price, 0);
    return design.basePrice + docsPrice + addons;
  }, [design, selectedDocumentExtras, selectedExtras]);

  const images = design?.images || [];
  const floorPlans = design?.floorPlans || [];

  const safeHeroIndex = images.length > 0 ? heroIndex % images.length : 0;
  const safeGalleryIndex = images.length > 0 ? galleryIndex % images.length : 0;
  const safeFloorPlanIndex =
    floorPlans.length > 0 ? activeFloorPlan % floorPlans.length : 0;

  const toggleDocument = (key: string) => {
    const option = documentOptions.find((item) => item.key === key);
    if (!option || option.locked || !option.availability) return;
    setSelectedFileTypes((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const toggleExtra = (id: string) => {
    setSelectedExtraIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAddToCart = async () => {
    if (!design || isAddingToCart || isBuyingNow) return;
    setIsAddingToCart(true);
    try {
      const added = await addToCart(design, selectedFileTypes, selectedExtras);
      if (added && status === "unauthenticated") {
        toast.info("Item saved. You will need to sign in at checkout.", {
          action: {
            label: "Sign in now",
            onClick: () => router.push("/auth?callbackUrl=%2Fcheckout"),
          },
          duration: 6000,
        });
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!design || isBuyingNow || isAddingToCart) return;
    setIsBuyingNow(true);
    try {
      // Continue to checkout even if item already exists in cart.
      await addToCart(design, selectedFileTypes, selectedExtras);
      if (status === "authenticated") {
        router.push("/checkout");
      } else {
        router.push("/auth?callbackUrl=%2Fcheckout");
      }
    } finally {
      setIsBuyingNow(false);
    }
  };

  if (loading) return <Loading />;

  if (error || !design) {
    return (
      <section className="min-h-screen bg-ink px-6 pb-20 pt-32 text-cream sm:px-10 lg:px-[60px]">
        <div className="mx-auto max-w-screen-md border border-[rgba(240,232,216,0.08)] bg-card p-10 text-center">
          <h1
            className="text-4xl font-light"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            {error === "Design not found"
              ? "Design not found"
              : "Unable to load design"}
          </h1>
          <p className="mt-3 font-mono text-[12px] text-cream-dim">
            {error || "This plan could not be loaded."}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => router.refresh()}
              className="border border-[rgba(240,232,216,0.14)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-cream-dim hover:text-cream"
            >
              Retry
            </button>
            <Link
              href="/designs"
              className="border border-[rgba(200,137,42,0.34)] bg-[rgba(200,137,42,0.1)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gold"
            >
              Back to Plans
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      className="bg-ink text-cream"
      style={{
        fontFamily:
          'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
      }}
    >
      <DesignViewTracker designId={design.id} />

      <div
        className="fixed left-0 top-0 z-[300] h-[2px] w-full origin-left bg-gold"
        style={{ transform: `scaleX(${progress})` }}
      />

      <section className="relative h-[92vh] min-h-[600px] overflow-hidden pt-[73px] sm:min-h-[640px]">
        <div className="absolute inset-0 bg-surface" />
        {images[safeHeroIndex]?.url ? (
          <Image
            src={images[safeHeroIndex].url}
            alt={design.name}
            fill
            priority
            className="object-cover brightness-[0.55] saturate-[0.8] scale-[1.04] transition-transform duration-[8000ms] ease-out"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(200,137,42,0.08),transparent_55%)]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,9,7,0.3)_0%,transparent_30%,rgba(10,9,7,0.5)_65%,#0a0907_100%),linear-gradient(130deg,rgba(200,137,42,0.07),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.4)_40%,rgba(0,0,0,0.4)_70%,transparent)]" />

        {images.length > 0 && (
          <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 lg:flex xl:right-[60px]">
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setHeroIndex(idx)}
                className={`h-[54px] w-[72px] overflow-hidden border transition-all ${
                  idx === safeHeroIndex
                    ? "border-gold opacity-100"
                    : "border-transparent opacity-55 hover:opacity-80"
                }`}
              >
                {img.url ? (
                  <Image
                    src={img.url}
                    alt={`${design.name} ${idx + 1}`}
                    width={72}
                    height={54}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-card" />
                )}
              </button>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setHeroIndex(
                  (prev) => (prev - 1 + images.length) % images.length,
                )
              }
              className="absolute left-5 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-[rgba(240,232,216,0.07)] bg-[rgba(10,9,7,0.5)] text-cream transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold lg:flex xl:left-[60px]"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setHeroIndex((prev) => (prev + 1) % images.length)}
              className="absolute left-[74px] top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-[rgba(240,232,216,0.07)] bg-[rgba(10,9,7,0.5)] text-cream transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold lg:flex xl:left-[114px]"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <div className="absolute bottom-[68px] right-5 z-10 hidden font-mono text-[11px] tracking-[0.1em] text-cream-dim xl:right-[60px] lg:block">
          <span className="text-gold">
            {String(safeHeroIndex + 1).padStart(2, "0")}
          </span>{" "}
          / <span>{String(Math.max(images.length, 1)).padStart(2, "0")}</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-10 sm:px-8 lg:px-[60px] lg:pb-16">
          <div className="mx-auto w-full max-w-screen-2xl">
            <nav className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[rgba(240,232,216,0.55)]">
              <Link href="/" className="transition-colors hover:text-gold">
                Home
              </Link>
              <ChevronRight size={10} />
              <Link
                href="/designs"
                className="transition-colors hover:text-gold"
              >
                Plans
              </Link>
              <ChevronRight size={10} />
              <span className="line-clamp-1 max-w-[220px] sm:max-w-full">
                {design.name}
              </span>
            </nav>

            <p className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
              <span className="h-px w-7 bg-gold" />
              {design.category?.name || "Design"}
            </p>

            <h1
              className="text-[clamp(42px,7vw,108px)] font-light leading-[0.92] tracking-[-0.025em]"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              <span className="block">
                {design.name.split(" ").slice(0, 2).join(" ")}
              </span>
              <span className="block">
                {design.name.split(" ").slice(2).join(" ") || ""}
                <em className="ml-2 text-gold italic">.</em>
              </span>
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-7">
              <div className="flex items-center gap-2 font-mono text-[12px] text-cream-dim">
                <Bed size={14} className="text-gold" />
                {design.bedrooms ?? "-"} Bedrooms
              </div>
              <div className="h-5 w-px bg-[rgba(240,232,216,0.07)]" />
              <div className="flex items-center gap-2 font-mono text-[12px] text-cream-dim">
                <Bath size={14} className="text-gold" />
                {design.bathrooms ?? "-"} Bathrooms
              </div>
              <div className="h-5 w-px bg-[rgba(240,232,216,0.07)]" />
              <div className="flex items-center gap-2 font-mono text-[12px] text-cream-dim">
                <House size={14} className="text-gold" />
                {design.area ? `${Math.round(design.area)} m2` : "Area N/A"}
              </div>
              <div className="h-5 w-px bg-[rgba(240,232,216,0.07)]" />
              <div className="flex items-center gap-2 font-mono text-[12px] text-cream-dim">
                <Layers size={14} className="text-gold" />
                {design.floors ?? "-"} Floors
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] px-5 pb-24 pt-8 sm:px-8 lg:px-[60px] lg:pt-10">
        <div className="mb-8 flex flex-wrap gap-2 border border-[rgba(240,232,216,0.07)] bg-card p-2">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("design-overview")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="border border-[rgba(240,232,216,0.07)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-dim transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("design-gallery")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="border border-[rgba(240,232,216,0.07)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-dim transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold"
          >
            Gallery
          </button>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("design-floorplans")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="border border-[rgba(240,232,216,0.07)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-dim transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold"
          >
            Floor Plans
          </button>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("design-faq")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="border border-[rgba(240,232,216,0.07)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-dim transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold"
          >
            FAQ
          </button>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("purchase-options")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="bg-gold px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-light"
          >
            Checkout
          </button>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:gap-[60px]">
          <div>
            <div id="design-overview" className="mb-12 scroll-mt-28">
              <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
                Overview{" "}
                <span className="h-px w-7 bg-[rgba(200,137,42,0.22)]" />
              </p>
              <div className="mb-4 flex items-start justify-between gap-5">
                <h2
                  className="text-[clamp(32px,4vw,52px)] font-light leading-[1.1]"
                  style={{
                    fontFamily:
                      'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                  }}
                >
                  {design.name}
                </h2>
                <button
                  type="button"
                  onClick={() => setWishlisted((prev) => !prev)}
                  className={`grid h-12 w-12 place-items-center border transition-all ${
                    wishlisted
                      ? "border-gold bg-[rgba(200,137,42,0.08)] text-gold"
                      : "border-[rgba(240,232,216,0.07)] text-cream-dim hover:border-[rgba(200,137,42,0.22)] hover:text-gold"
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    size={18}
                    fill={wishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>
              <p className="max-w-[680px] font-mono text-[13px] leading-[1.85] text-cream-dim">
                {design.description}
              </p>
            </div>

            <div className="mb-12 flex overflow-x-auto border border-[rgba(240,232,216,0.07)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { key: "Bedrooms", value: design.bedrooms ?? "-", icon: Bed },
                {
                  key: "Bathrooms",
                  value: design.bathrooms ?? "-",
                  icon: Bath,
                },
                {
                  key: "Area",
                  value: design.area ? `${Math.round(design.area)} m2` : "-",
                  icon: House,
                },
                { key: "Floors", value: design.floors ?? "-", icon: Layers },
                {
                  key: "Views",
                  value: design.views.toLocaleString(),
                  icon: Building2,
                },
                {
                  key: "Category",
                  value: design.category?.name || "General",
                  icon: Calculator,
                },
              ].map((item, idx) => (
                <div
                  key={`${item.key}-${idx}`}
                  className="min-w-[120px] flex-1 border-r border-[rgba(240,232,216,0.07)] bg-surface px-6 py-5 last:border-r-0"
                >
                  <item.icon size={16} className="mb-2 text-gold" />
                  <p
                    className="line-clamp-1 text-[22px] font-light leading-none"
                    style={{
                      fontFamily:
                        'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                    }}
                  >
                    {item.value}
                  </p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                    {item.key}
                  </p>
                </div>
              ))}
            </div>

            <div id="design-gallery" className="mb-12 scroll-mt-28">
              <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
                Gallery <span className="h-px w-7 bg-[rgba(200,137,42,0.22)]" />
              </p>

              <div className="relative mb-3 aspect-[16/10] cursor-zoom-in overflow-hidden border border-[rgba(240,232,216,0.07)] bg-card">
                {images[safeGalleryIndex]?.url ? (
                  <Image
                    src={images[safeGalleryIndex].url}
                    alt={`${design.name} preview ${safeGalleryIndex + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    onClick={() => {
                      setLightboxIndex(safeGalleryIndex);
                      setLightboxOpen(true);
                    }}
                  />
                ) : (
                  <div className="grid h-full place-items-center text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      No preview image
                    </p>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setGalleryIndex(
                          (prev) => (prev - 1 + images.length) % images.length,
                        )
                      }
                      className="absolute left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center border border-[rgba(240,232,216,0.07)] bg-[rgba(10,9,7,0.65)] text-cream transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setGalleryIndex((prev) => (prev + 1) % images.length)
                      }
                      className="absolute right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center border border-[rgba(240,232,216,0.07)] bg-[rgba(10,9,7,0.65)] text-cream transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 right-4 bg-[rgba(10,9,7,0.55)] px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-[rgba(240,232,216,0.75)]">
                  {String(safeGalleryIndex + 1).padStart(2, "0")} /{" "}
                  {String(Math.max(images.length, 1)).padStart(2, "0")}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIndex(safeGalleryIndex);
                    setLightboxOpen(true);
                  }}
                  className="absolute bottom-4 left-4 flex items-center gap-2 border border-[rgba(240,232,216,0.07)] bg-[rgba(10,9,7,0.55)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-cream-dim transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold"
                >
                  <Expand size={13} />
                  Expand
                </button>
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-[6px] sm:grid-cols-6">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setGalleryIndex(idx)}
                      className={`aspect-[3/2] overflow-hidden border transition-all ${
                        idx === safeGalleryIndex
                          ? "border-gold opacity-100"
                          : "border-transparent opacity-55 hover:opacity-80"
                      }`}
                    >
                      {img.url ? (
                        <Image
                          src={img.url}
                          alt={`${design.name} thumb ${idx + 1}`}
                          width={240}
                          height={160}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-card" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div id="design-floorplans" className="scroll-mt-28">
              <div className="mb-8 flex border-b border-[rgba(240,232,216,0.07)]">
                {[
                  { key: "details" as const, label: "Details" },
                  { key: "floorplans" as const, label: "Floor Plans" },
                  { key: "specs" as const, label: "Specifications" },
                  { key: "faq" as const, label: "FAQ" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors sm:px-6 ${
                      activeTab === tab.key
                        ? "text-gold"
                        : "text-muted hover:text-cream"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`absolute bottom-[-1px] left-0 right-0 h-px bg-gold transition-transform ${
                        activeTab === tab.key ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        label: "Design Type",
                        value: design.category?.name || "Residential",
                      },
                      {
                        label: "Floor Count",
                        value: String(design.floors ?? "N/A"),
                      },
                      {
                        label: "Bedrooms",
                        value: String(design.bedrooms ?? "N/A"),
                      },
                      {
                        label: "Bathrooms",
                        value: String(design.bathrooms ?? "N/A"),
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="border border-[rgba(240,232,216,0.07)] bg-surface px-5 py-4"
                      >
                        <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                          {item.label}
                        </p>
                        <p
                          className="text-xl font-light"
                          style={{
                            fontFamily:
                              'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                          }}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {design.planDetails.length > 0 && (
                    <ul className="space-y-3">
                      {design.planDetails.map((item, idx) => (
                        <li
                          key={`${item}-${idx}`}
                          className="flex items-start gap-3 font-mono text-[12px] text-cream-dim"
                        >
                          <span className="mt-[2px] grid h-[18px] w-[18px] shrink-0 place-items-center border border-[rgba(200,137,42,0.22)]">
                            <Check size={10} className="text-gold" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === "floorplans" && (
                <div>
                  {floorPlans.length === 0 ? (
                    <div className="border border-[rgba(240,232,216,0.07)] bg-surface px-6 py-12 text-center">
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                        No floor plans uploaded
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 grid grid-cols-2 border border-[rgba(240,232,216,0.07)] sm:grid-cols-4">
                        {floorPlans.map((fp, idx) => (
                          <button
                            key={fp.id}
                            type="button"
                            onClick={() => setActiveFloorPlan(idx)}
                            className={`border-r border-[rgba(240,232,216,0.07)] px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] ${
                              idx === safeFloorPlanIndex
                                ? "bg-[rgba(200,137,42,0.08)] text-gold"
                                : "text-muted hover:bg-card hover:text-cream"
                            }`}
                          >
                            Plan {idx + 1}
                          </button>
                        ))}
                      </div>
                      <div className="overflow-hidden border border-[rgba(240,232,216,0.07)] bg-card">
                        {floorPlans[safeFloorPlanIndex]?.url ? (
                          <Image
                            src={floorPlans[safeFloorPlanIndex].url || ""}
                            alt={`Floor plan ${safeFloorPlanIndex + 1}`}
                            width={1200}
                            height={800}
                            className="h-auto w-full object-contain"
                          />
                        ) : (
                          <div className="grid min-h-[360px] place-items-center">
                            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                              Floor plan preview unavailable
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "specs" && (
                <div className="space-y-4 border border-[rgba(240,232,216,0.07)] bg-surface p-6">
                  {[
                    ["Bedrooms", String(design.bedrooms ?? "N/A")],
                    ["Bathrooms", String(design.bathrooms ?? "N/A")],
                    [
                      "Total Area",
                      design.area ? `${Math.round(design.area)} m2` : "N/A",
                    ],
                    ["Floors", String(design.floors ?? "N/A")],
                    ["Category", design.category?.name || "General"],
                    ["Featured", design.isFeatured ? "Yes" : "No"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-b border-[rgba(240,232,216,0.07)] pb-3 font-mono text-[12px]"
                    >
                      <span className="uppercase tracking-[0.12em] text-muted">
                        {label}
                      </span>
                      <span className="text-cream-dim">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "faq" && (
                <div id="design-faq" className="scroll-mt-28">
                  {faqItems.length === 0 ? (
                    <div className="border border-[rgba(240,232,216,0.07)] bg-surface px-6 py-12 text-center">
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                        No FAQ entries yet
                      </p>
                    </div>
                  ) : (
                    <div>
                      {faqItems.map((faq, idx) => {
                        const open = openFaqIndex === idx;
                        return (
                          <div
                            key={`${faq.question}-${idx}`}
                            className="border-b border-[rgba(240,232,216,0.07)]"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setOpenFaqIndex((prev) =>
                                  prev === idx ? null : idx,
                                )
                              }
                              className="flex w-full items-center justify-between gap-4 py-5 text-left text-[16px] text-cream transition-colors hover:text-gold"
                              style={{
                                fontFamily:
                                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                              }}
                            >
                              {faq.question}
                              <span
                                className={`grid h-5 w-5 shrink-0 place-items-center border transition-colors ${
                                  open
                                    ? "border-[rgba(200,137,42,0.22)] bg-[rgba(200,137,42,0.08)]"
                                    : "border-[rgba(240,232,216,0.07)]"
                                }`}
                              >
                                {open ? (
                                  <Minus size={10} className="text-gold" />
                                ) : (
                                  <Plus size={10} />
                                )}
                              </span>
                            </button>
                            {open && (
                              <p className="pb-5 font-mono text-[13px] leading-[1.8] text-cream-dim">
                                {faq.answer}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside
            id="purchase-options"
            className="scroll-mt-28 lg:sticky lg:top-[100px]"
          >
            <div className="border border-[rgba(240,232,216,0.07)] bg-card p-8">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
                Starting From
              </p>
              <p
                className="text-[44px] font-light leading-none"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                {priceLabel(design.basePrice)}
              </p>
              <p className="mt-1 font-mono text-[11px] tracking-[0.06em] text-muted">
                ≈ KES {(design.basePrice * exchangeRate).toLocaleString()}
              </p>
              <p className="mt-3 font-mono text-[10px] tracking-[0.04em] text-muted">
                Architectural PDF included in base price
              </p>
            </div>

            {(
              [
                ["Architectural", "architectural"],
                ["Structural", "structural"],
                ["Additional", "additional"],
              ] as const
            ).map(([title, category]) => {
              const options = documentOptions.filter(
                (option) => option.category === category,
              );
              return (
                <div
                  key={category}
                  className="mt-px border border-[rgba(240,232,216,0.07)] bg-card"
                >
                  <div className="border-b border-[rgba(240,232,216,0.07)] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
                    {title} Documents
                  </div>
                  {options.map((option) => {
                    const selected =
                      selectedFileTypes.includes(option.key) || option.locked;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => toggleDocument(option.key)}
                        disabled={option.locked || !option.availability}
                        className={`flex w-full items-center gap-3 border-b border-[rgba(240,232,216,0.07)] px-5 py-4 text-left transition-colors last:border-b-0 ${
                          selected
                            ? "bg-[rgba(200,137,42,0.08)]"
                            : "hover:bg-[#1c1a17]"
                        } ${!option.availability ? "opacity-60" : ""}`}
                      >
                        <span
                          className={`grid h-5 w-5 shrink-0 place-items-center border ${
                            selected
                              ? "border-gold bg-gold text-ink"
                              : "border-[rgba(240,232,216,0.07)] text-transparent"
                          }`}
                        >
                          <Check size={11} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm text-cream">
                            {option.label}
                            <span
                              className={`ml-2 inline-block px-[7px] py-[2px] align-middle font-mono text-[9px] uppercase tracking-[0.12em] ${
                                option.availability
                                  ? "bg-[rgba(63,168,106,0.12)] text-[#3fa86a]"
                                  : "bg-[rgba(200,137,42,0.1)] text-gold"
                              }`}
                            >
                              {option.availability ? "Available" : "Coming"}
                            </span>
                          </span>
                          <span className="block font-mono text-[10px] tracking-[0.04em] text-muted">
                            {option.description}
                          </span>
                        </span>
                        <span
                          className={`font-mono text-[12px] ${
                            option.locked ? "text-[#3fa86a]" : "text-cream-dim"
                          }`}
                        >
                          {option.locked
                            ? "Included"
                            : priceLabel(option.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {design.packageOptions.length > 0 && (
              <div className="mt-px border border-[rgba(240,232,216,0.07)] bg-card">
                <div className="border-b border-[rgba(240,232,216,0.07)] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
                  Customizations
                </div>
                {design.packageOptions.map((option) => {
                  const selected = selectedExtraIds.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleExtra(option.id)}
                      className={`flex w-full items-center gap-3 border-b border-[rgba(240,232,216,0.07)] px-5 py-4 text-left transition-colors last:border-b-0 ${
                        selected
                          ? "bg-[rgba(200,137,42,0.08)]"
                          : "hover:bg-[#1c1a17]"
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center border ${
                          selected
                            ? "border-gold bg-gold text-ink"
                            : "border-[rgba(240,232,216,0.07)] text-transparent"
                        }`}
                      >
                        <Check size={11} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-cream">
                          {option.name}
                        </span>
                        {option.description && (
                          <span className="block font-mono text-[10px] tracking-[0.04em] text-muted">
                            {option.description}
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-[12px] text-cream-dim">
                        {priceLabel(option.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-px border border-[rgba(240,232,216,0.07)] bg-card px-6 py-6">
              <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-muted">
                <span>Base Plan</span>
                <span>{priceLabel(design.basePrice)}</span>
              </div>
              {selectedDocumentExtras.map((item) => (
                <div
                  key={item.key}
                  className="mb-2 flex items-center justify-between font-mono text-[11px] text-muted"
                >
                  <span>{item.label}</span>
                  <span>+ {priceLabel(item.price)}</span>
                </div>
              ))}
              {selectedExtras.map((item) => (
                <div
                  key={item.id}
                  className="mb-2 flex items-center justify-between font-mono text-[11px] text-muted"
                >
                  <span>{item.name}</span>
                  <span>+ {priceLabel(item.price)}</span>
                </div>
              ))}
              <div className="my-4 h-px bg-[rgba(240,232,216,0.07)]" />
              <div className="flex items-end justify-between">
                <span
                  className="text-[16px]"
                  style={{
                    fontFamily:
                      'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                  }}
                >
                  Total
                </span>
                <span
                  className="text-[28px] font-light text-gold"
                  style={{
                    fontFamily:
                      'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                  }}
                >
                  {priceLabel(totalPrice)}
                </span>
              </div>
              <p className="mt-1 text-right font-mono text-[11px] text-muted">
                ≈ KES {(totalPrice * exchangeRate).toLocaleString()}
              </p>
              <p className="mt-2 text-right font-mono text-[10px] text-muted">
                {selectedDocumentExtras.length + selectedExtras.length} add-ons
                selected
              </p>
            </div>

            <div className="mt-px space-y-px">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isBuyingNow || isAddingToCart}
                className="flex w-full items-center justify-center gap-2 bg-gold px-5 py-4 font-mono text-[12px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Download size={16} />
                {isBuyingNow ? "Processing..." : "Purchase Now"}
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isBuyingNow || isAddingToCart}
                className="flex w-full items-center justify-center gap-2 border border-[rgba(240,232,216,0.07)] bg-surface px-5 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-cream transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ShoppingCart size={15} />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <Link
                href={`/contact?designId=${design.id}`}
                className="flex w-full items-center justify-center gap-2 border border-[rgba(240,232,216,0.07)] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-dim transition-colors hover:bg-card hover:text-cream"
              >
                Request Consultation
              </Link>
            </div>
            <p className="mt-2 text-center font-mono text-[10px] text-muted">
              Secure checkout with instant digital delivery after payment.
            </p>

            <div className="mt-px grid grid-cols-2 gap-px bg-[rgba(240,232,216,0.07)]">
              <div className="flex items-center gap-2 bg-card px-4 py-3">
                <ShieldCheck size={16} className="text-[#3fa86a]" />
                <div>
                  <p className="text-[12px] leading-tight text-cream">
                    Secure Purchase
                  </p>
                  <p className="font-mono text-[9px] text-muted">256-bit SSL</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-3">
                <Download size={16} className="text-gold" />
                <div>
                  <p className="text-[12px] leading-tight text-cream">
                    Instant Access
                  </p>
                  <p className="font-mono text-[9px] text-muted">
                    Download now
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-3">
                <Phone size={16} className="text-[#3fa86a]" />
                <div>
                  <p className="text-[12px] leading-tight text-cream">
                    Expert Support
                  </p>
                  <p className="font-mono text-[9px] text-muted">
                    Mon-Sat 8am-6pm
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-3">
                <Clock3 size={16} className="text-gold" />
                <div>
                  <p className="text-[12px] leading-tight text-cream">
                    7-Day Query
                  </p>
                  <p className="font-mono text-[9px] text-muted">
                    Post-purchase help
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mb-20 w-full max-w-[1440px] border-t border-[rgba(240,232,216,0.07)] px-5 pt-16 sm:px-8 lg:px-[60px]">
          <div className="mb-10 flex items-end justify-between gap-3">
            <h2
              className="text-[clamp(32px,4vw,52px)] font-light leading-[1.1]"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              Similar <em className="text-gold">Designs</em>
            </h2>
            <Link
              href="/designs"
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-dim transition-colors hover:text-gold"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-px bg-[rgba(240,232,216,0.07)] md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/designs/${item.id}`}
                className="group bg-ink transition-colors hover:bg-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.images?.[0]?.url ? (
                    <Image
                      src={item.images[0].url}
                      alt={item.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover brightness-[0.78] transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-surface text-muted">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
                    {item.category?.name || "Design"}
                  </p>
                  <p
                    className="mb-4 text-[24px] font-light leading-[1.1]"
                    style={{
                      fontFamily:
                        'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                    }}
                  >
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between border-t border-[rgba(240,232,216,0.07)] pt-3">
                    <span className="font-mono text-[12px] text-cream-dim">
                      {priceLabel(item.basePrice)}
                    </span>
                    <ArrowRight size={14} className="text-gold" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(240,232,216,0.07)] bg-[rgba(20,18,16,0.96)] p-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-screen-md items-center gap-3">
          <div className="flex-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              Starting From
            </p>
            <p
              className="text-[22px] font-light text-gold"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              {priceLabel(totalPrice)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const sidebar = document.getElementById("purchase-options");
              if (sidebar)
                sidebar.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="flex-1 bg-gold px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
          >
            Purchase Now
          </button>
        </div>
      </div>

      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[rgba(10,9,7,0.96)] p-4 backdrop-blur-xl"
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxOpen(false);
          }}
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 grid h-10 w-10 place-items-center border border-[rgba(240,232,216,0.07)] text-cream transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold"
            >
              <Plus className="rotate-45" size={18} />
            </button>
            {images[lightboxIndex]?.url && (
              <Image
                src={images[lightboxIndex].url || ""}
                alt={`${design.name} enlarged ${lightboxIndex + 1}`}
                width={1600}
                height={1200}
                className="max-h-[85vh] w-auto max-w-[90vw] object-contain"
              />
            )}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex(
                      (prev) => (prev - 1 + images.length) % images.length,
                    )
                  }
                  className="absolute -left-12 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-[rgba(240,232,216,0.07)] bg-[rgba(10,9,7,0.6)] text-cream transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) => (prev + 1) % images.length)
                  }
                  className="absolute -right-12 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-[rgba(240,232,216,0.07)] bg-[rgba(10,9,7,0.6)] text-cream transition-colors hover:border-[rgba(200,137,42,0.22)] hover:text-gold"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
