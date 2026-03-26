import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

import { TrackingScript } from "@/components/TrackingScript";
import { VercelAnalytics } from "@/components/VercelAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "./Providers";

// Viewport configuration for mobile responsiveness
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "rgb(15 23 42)" },
  ],
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
      { url: "/images/concept-builders-logo-free-bg.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/concept-builders-logo-free-bg.png", type: "image/png" },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/images/concept-builders-logo-free-bg.png"
          as="image"
          type="image/png"
        />

        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Material Symbols Icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
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
        <div id="cb-cursor" className="cb-cursor hidden" aria-hidden="true" />
        <div
          id="cb-cursor-ring"
          className="cb-cursor-ring hidden"
          aria-hidden="true"
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="concept-builders-theme"
        >
          <Providers>
            {/* Main content container with mobile-safe areas */}
            <div className="min-h-screen flex flex-col safe-top safe-bottom">
              {children}
            </div>
          </Providers>

          {/* Enhanced Toaster with mobile positioning */}
          <Toaster
            position="top-center"
            duration={4000}
            closeButton
            richColors
            theme="system"
            visibleToasts={3}
            toastOptions={{
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
                fontSize: "14px",
                maxWidth: "calc(100vw - 32px)",
                margin: "8px",
              },
              classNames: {
                toast: "!rounded-xl !shadow-lg !border",
                success: "!border-green-200 dark:!border-green-800",
                error: "!border-red-200 dark:!border-red-800",
                warning: "!border-yellow-200 dark:!border-yellow-800",
                info: "!border-blue-200 dark:!border-blue-800",
              },
            }}
          />
        </ThemeProvider>

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

        <Script
          id="custom-cursor"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
                if (!supportsFinePointer) return;

                const cursor = document.getElementById('cb-cursor');
                const ring = document.getElementById('cb-cursor-ring');
                if (!cursor || !ring) return;

                document.body.classList.add('custom-cursor-enabled');
                cursor.classList.remove('hidden');
                ring.classList.remove('hidden');

                let mx = 0;
                let my = 0;
                let rx = 0;
                let ry = 0;

                const animateCursor = () => {
                  rx += (mx - rx) * 0.15;
                  ry += (my - ry) * 0.15;
                  cursor.style.left = mx + 'px';
                  cursor.style.top = my + 'px';
                  ring.style.left = rx + 'px';
                  ring.style.top = ry + 'px';
                  requestAnimationFrame(animateCursor);
                };

                document.addEventListener('mousemove', function (event) {
                  mx = event.clientX;
                  my = event.clientY;
                }, { passive: true });

                const onPointerOver = function (event) {
                  const target = event.target;
                  if (!(target instanceof Element)) return;
                  if (target.closest('a, button, input, textarea, select, label, [role="button"], [tabindex]:not([tabindex="-1"])')) {
                    ring.classList.add('expand');
                  }
                };

                const onPointerOut = function (event) {
                  const target = event.target;
                  if (!(target instanceof Element)) return;
                  if (target.closest('a, button, input, textarea, select, label, [role="button"], [tabindex]:not([tabindex="-1"])')) {
                    ring.classList.remove('expand');
                  }
                };

                document.addEventListener('mouseover', onPointerOver, { passive: true });
                document.addEventListener('mouseout', onPointerOut, { passive: true });

                animateCursor();
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
