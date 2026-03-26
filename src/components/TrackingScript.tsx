"use client";

import Script from "next/script";

export function TrackingScript() {
  return <Script src="/track.js" strategy="lazyOnload" />;
}
