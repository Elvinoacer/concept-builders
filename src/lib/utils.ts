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

export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
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
  url: string;
  type?: string;
}

export function getPrimaryDesignImage(design?: { images?: ImageLike[] | null } | null): string {
  if (!design || !design.images || design.images.length === 0) {
    return "/images/category-placeholder.webp";
  }
  const validImage = design.images.find(
    (img) =>
      img.url &&
      (img.type === "IMAGE" ||
        img.url.match(/\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$)/i))
  );
  return validImage?.url || "/images/category-placeholder.webp";
}
