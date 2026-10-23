"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  LoaderCircle,
  RotateCcw,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  imageLabel,
  planDestination,
  planFacts,
  type LandingImage,
  type LandingPlan,
} from "@/lib/landing-designs";

const galleries = new Map<string, LandingImage[]>();

function useGallery(plan: LandingPlan) {
  const [result, setResult] = useState<{
    id?: string;
    images: LandingImage[];
    failed: boolean;
    loading: boolean;
  }>({ images: plan.images, failed: false, loading: Boolean(plan.id) });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!plan.id) return;
    const id = plan.id;
    const cached = galleries.get(id);
    if (cached) {
      setResult({ id, images: cached, failed: false, loading: false });
      return;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    let disposed = false;
    setResult({ id, images: plan.images, failed: false, loading: true });
    fetch(`/api/designs/${encodeURIComponent(id)}?preview=true`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Preview unavailable");
        const data: { id?: string; images?: LandingImage[] } =
          await response.json();
        if (data.id !== id || !Array.isArray(data.images))
          throw new Error("Invalid preview");
        const seen = new Set<string>();
        const images = data.images.filter((image) => {
          if (
            typeof image.url !== "string" ||
            !image.url ||
            seen.has(image.url) ||
            (image.type && image.type !== "IMAGE")
          )
            return false;
          seen.add(image.url);
          return true;
        });
        if (!images.length) throw new Error("No published perspectives");
        if (disposed) return;
        galleries.set(id, images);
        if (galleries.size > 12)
          galleries.delete(galleries.keys().next().value!);
        setResult({ id, images, failed: false, loading: false });
      })
      .catch(() => {
        if (!disposed)
          setResult({ id, images: plan.images, failed: true, loading: false });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      disposed = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [plan.id, plan.images, attempt]);
  return {
    images: result.id === plan.id ? result.images : plan.images,
    loading: Boolean(plan.id) && (result.id !== plan.id || result.loading),
    failed: result.id === plan.id && result.failed,
    retry: () => setAttempt((value) => value + 1),
  };
}

function PreviewGallery({ plan }: { plan: LandingPlan }) {
  const { images, loading, failed, retry } = useGallery(plan);
  const [selectedUrl, setSelectedUrl] = useState(plan.images[0].url);
  const [zoomed, setZoomed] = useState(false);
  const [loadedUrl, setLoadedUrl] = useState("");
  const [failedUrl, setFailedUrl] = useState("");
  const touchRef = useRef({ x: 0, y: 0 });
  const current = Math.max(
    0,
    images.findIndex((image) => image.url === selectedUrl),
  );
  const image = images[current];
  const facts = planFacts(plan);
  function select(index: number) {
    setSelectedUrl(images[(index + images.length) % images.length].url);
    setZoomed(false);
  }
  const requestUrl = `/custom-design?${new URLSearchParams({ ...(plan.id ? { inspired_by: plan.id } : {}), style: plan.category, image: plan.images[0].url })}`;

  return (
    <div
      className="home-preview__body"
      onKeyDown={(event) => {
        if (zoomed || event.altKey || event.metaKey || event.ctrlKey) return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          select(current + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          select(current - 1);
        }
      }}
    >
      <div className="home-preview__gallery">
        <div
          className={`home-preview__image${zoomed ? " home-preview__image--zoomed" : ""}`}
          onTouchStart={(event) => {
            touchRef.current = {
              x: event.touches[0].clientX,
              y: event.touches[0].clientY,
            };
          }}
          onTouchEnd={(event) => {
            if (zoomed) return;
            const dx = event.changedTouches[0].clientX - touchRef.current.x;
            const dy = event.changedTouches[0].clientY - touchRef.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
              select(current + (dx < 0 ? 1 : -1));
          }}
        >
          <div className="home-preview__image-inner">
            <Image
              src={image.url}
              alt={`${plan.name} — ${imageLabel(image, current)}`}
              fill
              sizes="(max-width: 760px) 96vw, 80vw"
              className="home-preview__render"
              onLoad={() => setLoadedUrl(image.url)}
              onError={() => setFailedUrl(image.url)}
            />
          </div>
          {loadedUrl !== image.url && failedUrl !== image.url && (
            <span className="home-preview__loading">
              <LoaderCircle size={18} aria-hidden="true" /> Loading perspective
            </span>
          )}
          {failedUrl === image.url && (
            <span className="home-preview__loading">
              This view is unavailable. Please try another perspective.
            </span>
          )}
        </div>
        <div className="home-preview__image-controls">
          <span aria-live="polite">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
            <span> — {imageLabel(image, current)}</span>
          </span>
          <div>
            <button
              type="button"
              onClick={() => setZoomed((value) => !value)}
              aria-label={zoomed ? "Fit complete image" : "Zoom into image"}
            >
              {zoomed ? <RotateCcw size={16} /> : <Expand size={16} />}
            </button>
            <button
              type="button"
              disabled={images.length < 2}
              onClick={() => select(current - 1)}
              aria-label="Previous perspective"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              type="button"
              disabled={images.length < 2}
              onClick={() => select(current + 1)}
              aria-label="Next perspective"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
        <div
          className="home-preview__thumbnails"
          aria-label="Select a house perspective"
        >
          {images.map((view, index) => (
            <button
              type="button"
              key={view.url}
              aria-label={`Show ${imageLabel(view, index)}`}
              aria-pressed={index === current}
              onClick={() => select(index)}
            >
              <Image
                src={view.url}
                alt=""
                fill
                sizes="88px"
                className="home-preview__render"
              />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className="home-preview__status" aria-live="polite">
          {loading ? (
            "Loading all published perspectives…"
          ) : failed ? (
            <>
              Showing available views.{" "}
              <button type="button" onClick={retry}>
                Try loading the full gallery again
              </button>
            </>
          ) : (
            <>
              <Check size={12} aria-hidden="true" /> Every perspective, in full.
            </>
          )}
        </div>
      </div>
      <aside className="home-preview__details">
        <p className="home-eyebrow">{plan.category}</p>
        <Dialog.Title className="home-preview__title">{plan.name}</Dialog.Title>
        <Dialog.Description className="home-preview__description">
          Take your time. Explore the architecture from every available
          perspective.
        </Dialog.Description>
        {facts.length > 0 && (
          <div className="home-preview__facts">
            {facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
        )}
        {typeof plan.basePrice === "number" && plan.basePrice > 0 && (
          <div className="home-preview__price">
            <span>Plan pricing from</span>
            <p>{formatCurrency(plan.basePrice)}</p>
          </div>
        )}
        <div className="home-preview__actions">
          <Link href={planDestination(plan)}>
            {plan.id ? "View plan details" : "Make this your inspiration"}
            <ArrowUpRight size={16} />
          </Link>
          <Link href={requestUrl}>
            Request a similar design <ArrowUpRight size={16} />
          </Link>
        </div>
        <p className="home-preview__hint">
          A home can be adapted to your plot, your budget, and the way you live.
        </p>
      </aside>
    </div>
  );
}

export default function DesignModal({
  plan,
  collection,
  onSelect,
  onClose,
  onRestoreFocus,
}: {
  plan: LandingPlan;
  collection: LandingPlan[];
  onSelect: (plan: LandingPlan) => void;
  onClose: () => void;
  onRestoreFocus: () => void;
}) {
  const index = collection.findIndex(
    (item) => (item.id ?? item.name) === (plan.id ?? plan.name),
  );
  const changeHome = (direction: number) =>
    onSelect(
      collection[
        (Math.max(0, index) + direction + collection.length) % collection.length
      ],
    );
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="home-preview-overlay" />
        <Dialog.Content
          className="home-preview"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            onRestoreFocus();
          }}
        >
          <div className="home-preview__header">
            <span className="home-preview__wordmark">
              Concept Builders <span>/ The house gallery</span>
            </span>
            <div className="home-preview__home-nav">
              <button
                type="button"
                disabled={collection.length < 2}
                onClick={() => changeHome(-1)}
                aria-label="Previous home"
              >
                <ArrowLeft size={16} />
                <span>Previous home</span>
              </button>
              <span>
                {String(Math.max(0, index) + 1).padStart(2, "0")} /{" "}
                {String(collection.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                disabled={collection.length < 2}
                onClick={() => changeHome(1)}
                aria-label="Next home"
              >
                <span>Next home</span>
                <ArrowRight size={16} />
              </button>
            </div>
            <Dialog.Close
              className="home-preview__close"
              aria-label="Close house preview"
            >
              <X size={20} />
            </Dialog.Close>
          </div>
          <PreviewGallery key={plan.id ?? plan.name} plan={plan} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
