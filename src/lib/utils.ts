import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}

interface ImageLike {
  url?: string | null;
  type?: string | null;
}

const IMAGE_URL_PATTERN = /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|#|$)/i;
const NON_IMAGE_FILE_PATTERN = /\.(pdf|dwg|dxf|pln|doc|docx|xls|xlsx|zip|rar)(\?|#|$)/i;

function isDisplayableDesignImage(img: { url: string; type?: string | null }) {
  const normalizedType = img.type?.toUpperCase();
  return (
    normalizedType === "IMAGE" ||
    IMAGE_URL_PATTERN.test(img.url) ||
    (!normalizedType && !NON_IMAGE_FILE_PATTERN.test(img.url))
  );
}

/** All displayable design images (deduped), for multi-image card teasers. */
export function getDesignImages(
  design?: { images?: ImageLike[] | null; files?: ImageLike[] | null } | null,
  limit = 4,
): string[] {
  const candidates = [
    ...(design?.images ?? []),
    ...(design?.files ?? []),
  ].filter((img): img is { url: string; type?: string | null } => Boolean(img?.url));

  const urls: string[] = [];
  const seen = new Set<string>();

  for (const img of candidates) {
    if (!isDisplayableDesignImage(img) || seen.has(img.url)) continue;
    seen.add(img.url);
    urls.push(img.url);
    if (urls.length >= limit) break;
  }

  return urls;
}

export function getPrimaryDesignImage(
  design?: { images?: ImageLike[] | null; files?: ImageLike[] | null } | null,
): string {
  const images = getDesignImages(design, 1);
  return images[0] || "/images/category-placeholder.webp";
}
