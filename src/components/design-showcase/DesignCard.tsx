"use client";

import { useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  House,
  Images,
  Layers3,
  Ruler,
  Sparkles,
} from "lucide-react";
import { formatCurrency, getDesignImages } from "@/lib/utils";
import styles from "./designs.module.css";

interface DesignImage {
  url: string;
  type: string;
}
interface Design {
  id: string;
  name: string;
  description?: string;
  images: DesignImage[];
  files?: DesignImage[];
  isFeatured?: boolean;
  discounts?: {
    discount: {
      id?: string;
      code?: string;
      type?: string;
      value: number;
      isActive?: boolean;
    };
  }[];
  orderItems?: { id: string }[];
  basePrice: number;
  architecturalPdfPrice?: number;
  architecturalCadPrice?: number;
  structuralPdfPrice?: number;
  structuralCadPrice?: number;
  billOfQuantitiesPrice?: number;
  minBuildingCost?: number | null;
  maxBuildingCost?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  floors?: number | null;
  category?: { id: string; name: string } | null;
  views?: number;
}
interface DesignCardProps {
  design: Design;
  index: number;
  showDetails?: boolean;
  priceType?: string;
  onCardClick?: (id: string) => void;
}

const FALLBACK_IMAGE = "/images/category-placeholder.webp";

export default function DesignCard({
  design,
  index,
  showDetails = true,
  priceType,
  onCardClick,
}: DesignCardProps) {
  const gallery = useMemo(() => {
    const images = getDesignImages(
      { images: design.images, files: design.files },
      4,
    );
    return images.length ? images : [FALLBACK_IMAGE];
  }, [design.images, design.files]);
  const [imageIndex, setImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [directImages, setDirectImages] = useState<string[]>([]);
  const activeImage = imageIndex % gallery.length;
  const currentImage = gallery[activeImage];
  const codeMatch = design.name.match(/\s*\((CB[\w-]+)\)\s*$/i);
  const originalTitle = codeMatch
    ? design.name.slice(0, codeMatch.index).trim()
    : design.name;
  const title =
    originalTitle === originalTitle.toUpperCase()
      ? originalTitle
          .toLowerCase()
          .replace(/\b\w/g, (letter) => letter.toUpperCase())
      : originalTitle;
  const discount = design.discounts?.find(
    (item) => item.discount.isActive !== false,
  )?.discount;
  const discountedPrice = discount
    ? Math.max(
        0,
        discount.type === "FIXED_AMOUNT"
          ? design.basePrice - discount.value
          : design.basePrice * (1 - discount.value / 100),
      )
    : design.basePrice;
  const showBuildCost = priceType === "building";

  function handleActivate(event: MouseEvent<HTMLAnchorElement>) {
    if (onCardClick) {
      event.preventDefault();
      onCardClick(design.id);
    }
  }

  return (
    <div className={styles.card}>
      <Link
        href={`/designs/${design.id}`}
        onClick={handleActivate}
        className={styles.cardLink}
        aria-label={`Explore ${design.name}`}
        prefetch={false}
      />
      <div className={styles.cardImage}>
        {failedImages.includes(currentImage) ||
        currentImage === FALLBACK_IMAGE ? (
          <div
            className={styles.imageUnavailable}
            role="img"
            aria-label={`Image preview unavailable for ${design.name}`}
          >
            <House size={42} strokeWidth={0.8} aria-hidden="true" />
            <span>Image preview unavailable</span>
            <small>Discover the details inside.</small>
          </div>
        ) : (
          <Image
            src={currentImage}
            alt={`${design.name} — view ${activeImage + 1}`}
            fill
            sizes="(max-width: 539px) calc(100vw - 40px), (max-width: 767px) 45vw, (max-width: 1023px) 46vw, (max-width: 1279px) 35vw, 27vw"
            priority={index < 3}
            unoptimized={directImages.includes(currentImage)}
            onError={() => {
              // If the optimiser cannot reach the CDN, try its original image
              // directly before showing an honest, neutral unavailable state.
              if (
                currentImage.startsWith("https://") &&
                !directImages.includes(currentImage)
              ) {
                setDirectImages((previous) => [...previous, currentImage]);
              } else {
                setFailedImages((previous) =>
                  previous.includes(currentImage)
                    ? previous
                    : [...previous, currentImage],
                );
              }
            }}
          />
        )}
        {design.isFeatured && (
          <span className={styles.featuredBadge}>
            <Sparkles size={10} aria-hidden="true" /> Featured plan
          </span>
        )}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.galleryArrow} ${styles.previousImage}`}
              onClick={() =>
                setImageIndex(
                  (previous) =>
                    (previous + gallery.length - 1) % gallery.length,
                )
              }
              aria-label={`Previous photo of ${design.name}`}
            >
              <ChevronLeft size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${styles.galleryArrow} ${styles.nextImage}`}
              onClick={() =>
                setImageIndex((previous) => (previous + 1) % gallery.length)
              }
              aria-label={`Next photo of ${design.name}`}
            >
              <ChevronRight size={15} aria-hidden="true" />
            </button>
            <span className={styles.galleryProgress} aria-hidden="true">
              {gallery.map((url, position) => (
                <span key={url} data-active={position === activeImage} />
              ))}
            </span>
            <span className={styles.imageCount}>
              <Images size={11} aria-hidden="true" />
              {activeImage + 1} / {gallery.length}
            </span>
          </>
        )}
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardCategory}>
          <span>{design.category?.name || "House plan"}</span>
          {codeMatch && <span>{codeMatch[1]}</span>}
        </p>
        <h3 className={styles.cardTitle}>{title}</h3>
        {showDetails && (
          <div className={styles.cardSpecs}>
            {design.bedrooms != null && (
              <span>
                <BedDouble size={14} strokeWidth={1.4} aria-hidden="true" />
                {design.bedrooms} bed{design.bedrooms === 1 ? "" : "s"}
              </span>
            )}
            {design.bathrooms != null && (
              <span>
                <Bath size={14} strokeWidth={1.4} aria-hidden="true" />
                {design.bathrooms} bath{design.bathrooms === 1 ? "" : "s"}
              </span>
            )}
            {design.area != null && design.area > 0 && (
              <span>
                <Ruler size={14} strokeWidth={1.4} aria-hidden="true" />
                {design.area.toLocaleString()} m²
              </span>
            )}
            {design.area == null && design.floors != null && (
              <span>
                <Layers3 size={14} strokeWidth={1.4} aria-hidden="true" />
                {design.floors} floor{design.floors === 1 ? "" : "s"}
              </span>
            )}
            {design.bedrooms == null &&
              design.bathrooms == null &&
              design.area == null &&
              design.floors == null && <span>Explore plan details</span>}
          </div>
        )}
        <div className={styles.cardFooter}>
          <div>
            <span className={styles.priceLabel}>
              {showBuildCost
                ? "Estimated build cost · USD"
                : "Plan price · USD"}
            </span>
            <span className={styles.cardPrice}>
              {showBuildCost ? (
                design.minBuildingCost ? (
                  `From ${formatCurrency(design.minBuildingCost)}`
                ) : (
                  "Ask for an estimate"
                )
              ) : design.basePrice === 0 ? (
                "Request a quote"
              ) : (
                <>
                  {discount && discountedPrice < design.basePrice && (
                    <del>{formatCurrency(design.basePrice)}</del>
                  )}
                  {formatCurrency(discountedPrice)}
                </>
              )}
            </span>
          </div>
          <span className={styles.cardCta}>
            View plan <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}
