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
const NON_IMAGE_FILE_PATTERN = /\.(pdf|dwg|dxf|doc|docx|xls|xlsx|zip|rar)(\?|#|$)/i;

export function getPrimaryDesignImage(
  design?: { images?: ImageLike[] | null; files?: ImageLike[] | null } | null,
): string {
  const candidates = [
    ...(design?.images ?? []),
    ...(design?.files ?? []),
  ].filter((img): img is { url: string; type?: string | null } => Boolean(img?.url));

  if (candidates.length === 0) {
    return "/images/category-placeholder.webp";
  }

  const validImage = candidates.find((img) => {
    const normalizedType = img.type?.toUpperCase();
    return (
      normalizedType === "IMAGE" ||
      IMAGE_URL_PATTERN.test(img.url) ||
      (!normalizedType && !NON_IMAGE_FILE_PATTERN.test(img.url))
    );
  });

  return validImage?.url || candidates[0].url || "/images/category-placeholder.webp";
}
