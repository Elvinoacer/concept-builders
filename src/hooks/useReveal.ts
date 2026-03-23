"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useReveal Hook
 * 
 * A reusable intersection observer hook for scroll-reveal animations.
 * Extracted from the landing page to provide consistent reveal behavior
 * across all pages.
 * 
 * @param delay - Delay in milliseconds before the reveal animation starts
 * @returns Object with ref, className, and style to apply to the element
 * 
 * @example
 * ```tsx
 * const headerReveal = useReveal<HTMLDivElement>(0);
 * 
 * return (
 *   <div ref={headerReveal.ref} className={headerReveal.className} style={headerReveal.style}>
 *     Content to reveal
 *   </div>
 * );
 * ```
 */
export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return {
    ref,
    className: `reveal ${visible ? "visible" : ""}`,
    style: { transitionDelay: `${delay}ms` },
  };
}
