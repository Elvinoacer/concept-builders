"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function scrollWindowToTop() {
  if (typeof window === "undefined") return;

  // CSS `scroll-behavior: smooth` can force animated jumps; disable for the reset
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  window.scrollTo(0, 0);
  root.scrollTop = 0;
  document.body.scrollTop = 0;

  // Some layouts nest overflow on a main scroller
  const main = document.querySelector("main");
  if (main instanceof HTMLElement && main.scrollTop > 0) {
    main.scrollTop = 0;
  }

  root.style.scrollBehavior = previousBehavior;
}

/**
 * Resets scroll to the top on every client-side route change.
 * Skips pure hash navigations (e.g. #explorer) so in-page anchors still work.
 */
function ScrollToTopInner() {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";
  const previousRoute = useRef<string | null>(null);

  useEffect(() => {
    const routeKey = `${pathname}?${search}`;

    // First paint: let the browser handle initial load; only fix SPA navigations
    if (previousRoute.current === null) {
      previousRoute.current = routeKey;
      // Still correct a restored mid-page position on hard entry with no hash
      if (!window.location.hash) {
        scrollWindowToTop();
      }
      return;
    }

    if (previousRoute.current === routeKey) return;
    const previousPathname = previousRoute.current.split("?")[0];
    previousRoute.current = routeKey;

    // Catalogue filters update the URL while the visitor stays at their place.
    if (pathname === "/designs" && previousPathname === pathname) return;

    // Keep intentional in-page anchors
    if (window.location.hash) return;

    // rAF: wait one frame so the new page has painted before scrolling
    const frame = window.requestAnimationFrame(() => {
      scrollWindowToTop();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, search]);

  return null;
}

export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopInner />
    </Suspense>
  );
}
