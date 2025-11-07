import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans, Work_Sans } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

import { TrackingScript } from "@/components/TrackingScript";
import { VercelAnalytics } from "@/components/VercelAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "./Providers";

// Optimized font loading with subsets and display swap
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans",
  weight: ["400", "500", "700", "900"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "500", "700", "900"],
});

// Viewport configuration for mobile responsiveness
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://conceptbuilders.com"), // Updated to production URL
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
    url: "https://conceptbuilders.com",
    siteName: "Concept Builders",
    title: "Concept Builders - Build Your Dream Home",
    description:
      "Transform your vision into reality with Concept Builders. Expert home construction, renovation, and design services.",
    images: [
      {
        url: "/images/og-image.jpg",
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
    images: ["/images/twitter-image.jpg"],
    creator: "@conceptbuilders",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
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
    "msapplication-TileColor": "#da532c",
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
      suppressHydrationWarning
      className={`${inter.variable} ${notoSans.variable} ${workSans.variable}`}
    >
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

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Concept Builders",
              alternateName: "Concept Builders Construction",
              url: "https://conceptbuilders.com",
              logo: "https://conceptbuilders.com/images/concept-builders-logo-free-bg.png",
              description:
                "Professional home construction and renovation services",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Your City",
                addressRegion: "Your State",
                postalCode: "Your ZIP",
                addressCountry: "US",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-123-4567",
                contactType: "customer service",
                areaServed: "US",
                availableLanguage: ["en"],
              },
              sameAs: [
                "https://www.facebook.com/conceptbuilders",
                "https://www.instagram.com/conceptbuilders",
                "https://www.linkedin.com/company/conceptbuilders",
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
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Additional responsive meta tags */}
        <meta name="screen-orientation" content="portrait" />
        <meta name="full-screen" content="yes" />
        <meta name="browsermode" content="application" />

        {/* Disable auto-translation on some browsers */}
        <meta name="google" content="notranslate" />
      </head>
      <body
        className={`
          ${inter.className}
          antialiased
          min-h-screen
          bg-white
          dark:bg-gray-950
          text-gray-900
          dark:text-gray-100
          overflow-x-hidden
          selection:bg-primary/20
          selection:text-primary-foreground
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
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

        {/* Performance monitoring script */}
        <Script
          id="performance-monitoring"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('connection' in navigator) {
                const connection = navigator.connection;
                if (connection) {
                  console.log('Connection type:', connection.effectiveType);
                  console.log('Data saver:', connection.saveData);
                  
                  // Adjust loading behavior based on connection
                  if (connection.saveData || connection.effectiveType === 'slow-2g') {
                    // Implement data-saving measures
                    window.__DATA_SAVER_MODE = true;
                  }
                }
              }
              
              // Monitor largest contentful paint
              new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
              }).observe({type: 'largest-contentful-paint', buffered: true});
              
              // Monitor cumulative layout shift
              new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                  if (!entry.hadRecentInput) {
                    console.log('CLS:', entry.value);
                  }
                }
              }).observe({type: 'layout-shift', buffered: true});
            `,
          }}
        />

        {/* Service Worker Registration for PWA */}
        <Script
          id="service-worker-registration"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
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
          strategy="afterInteractive"
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
              
              // Prevent zoom on double-tap (for iOS)
              let lastTouchEnd = 0;
              document.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                  event.preventDefault();
                }
                lastTouchEnd = now;
              }, false);
            `,
          }}
        />
      </body>
    </html>
  );
}
