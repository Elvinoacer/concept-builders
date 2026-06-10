import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { TrackingScript } from "@/components/TrackingScript";
import { VercelAnalytics } from "@/components/VercelAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "./Providers";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-garamond",
  display: "swap",
  preload: true,
});

// Viewport configuration for mobile responsiveness
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0a0907",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://conceptbuilders.co.ke"), // Updated to production URL
  title: {
    default: "Concept Builders - Build Your Dream Home",
    template: "%s | Concept Builders",
  },
  description:
    "Transform your vision into reality with Concept Builders. Expert home construction, renovation, and design services for your dream home.",
  keywords: [
    "home construction",
    "building contractors",
    "home renovation",
    "dream home",
    "construction services",
    "home design",
  ],
  authors: [{ name: "Concept Builders" }],
  creator: "Concept Builders",
  publisher: "Concept Builders",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://conceptbuilders.co.ke",
    siteName: "Concept Builders",
    title: "Concept Builders - Build Your Dream Home",
    description:
      "Transform your vision into reality with Concept Builders. Expert home construction, renovation, and design services.",
    images: [
      {
        url: "https://conceptbuilders.co.ke/images/concept-builders-logo-free-bg.png",
        width: 1200,
        height: 630,
        alt: "Concept Builders - Professional Construction Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Concept Builders - Build Your Dream Home",
    description: "Transform your vision into reality with Concept Builders.",
    images: [
      "https://conceptbuilders.co.ke/images/concept-builders-logo-free-bg.png",
    ],
    creator: "@conceptbuilders",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/images/concept-builders-logo-free-bg.webp",
        type: "image/webp",
      },
    ],
    apple: [
      {
        url: "/images/concept-builders-logo-free-bg.webp",
        type: "image/webp",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Concept Builders",
  },
  verification: {
    // Add your verification codes here for Google Search Console, etc.
    // google: "verification-code",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "rgb(218 83 44)",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/images/concept-builders-logo-free-bg.webp"
          as="image"
          type="image/webp"
        />

        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/images/banners/banner1.webp"
          imageSrcSet="/images/banners/banner1-mobile.webp 828w, /images/banners/banner1.webp 1920w"
          imageSizes="100vw"
        />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Concept Builders",
              alternateName: "Concept Builders Construction",
              url: "https://conceptbuilders.co.ke",
              logo: "https://conceptbuilders.co.ke/images/concept-builders-logo-free-bg.png",
              description:
                "Professional home construction and renovation services",
              address: {
                "@type": "20100",
                addressLocality: "Nakuru",
                addressRegion: "20100",
                postalCode: "20100",
                addressCountry: "KE",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+254741360865",
                contactType: "customer service",
                areaServed: "KE",
                availableLanguage: ["en"],
              },
              sameAs: [
                "https://www.tiktok.com/@wilsonwarainy?is_from_webapp=1&sender_device=pc",
                "https://www.facebook.com/conceptbuilders",
                "https://www.instagram.com/conceptbuilderske?igsh=YzljYTk1ODg3Zg==",
                "https://linkedin.com/company/conceptbuilders",
                "https://elvin-juma-portfolio.vercel.app/",
                "https://www.google.com/maps/dir/?api=1&destination=-0.285245,36.0683192",
              ],
            }),
          }}
        />

        {/* Mobile-specific meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />

        {/* PWA meta tags */}
        <meta name="application-name" content="Concept Builders" />
        <meta name="apple-mobile-web-app-title" content="Concept Builders" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Theme color for different platforms */}
        <meta name="msapplication-TileColor" content="rgb(15 23 42)" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Additional responsive meta tags */}
        <meta name="screen-orientation" content="portrait" />
        <meta name="full-screen" content="yes" />
        <meta name="browsermode" content="application" />

        {/* Disable auto-translation on some browsers */}
        <meta name="google" content="notranslate" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary-foreground">
        <Providers>
          {/* Main content container with mobile-safe areas */}
          <div className="min-h-screen flex flex-col safe-top safe-bottom">
            {children}
          </div>
        </Providers>

        {/* Performance and Analytics */}
        <VercelAnalytics />

        <SpeedInsights
          sampleRate={0.1} // 10% of users
        />

        {/* External Scripts with optimized loading */}
        <TrackingScript />

        {/* Service Worker Registration for PWA */}
        <Script
          id="service-worker-registration"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      if (registration.waiting) {
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                      }

                      registration.addEventListener('updatefound', function() {
                        const installingWorker = registration.installing;
                        if (!installingWorker) return;
                        installingWorker.addEventListener('statechange', function() {
                          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            window.location.reload();
                          }
                        });
                      });
                    },
                    function(err) {
                      console.error('ServiceWorker registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />

        {/* Touch detection for mobile interactions */}
        <Script
          id="touch-detection"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              // Detect touch device
              function isTouchDevice() {
                return (('ontouchstart' in window) ||
                  (navigator.maxTouchPoints > 0) ||
                  (navigator.msMaxTouchPoints > 0));
              }
              
              // Add touch class to body for CSS targeting
              if (isTouchDevice()) {
                document.body.classList.add('touch-device');
              } else {
                document.body.classList.add('no-touch-device');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
