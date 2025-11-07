
'use client';

import Script from 'next/script';

export function TrackingScript() {
  return (
    <Script
      src="/track.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('Tracking script loaded successfully');
      }}
      onError={() => {
        console.warn('Tracking script failed to load');
      }}
    />
  );
}
