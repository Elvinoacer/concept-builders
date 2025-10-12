import { Toaster } from 'sonner';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { ThemeProvider } from "@/components/theme-provider";
import PayPalProviderWrapper from "@/components/PayPalProviderWrapper";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Concept Builders",
  description: "Build Your Dream Home",
  icons: {
    icon: "/images/concept-builders-logo-free-bg.png",
  },
  openGraph: {
    title: "Concept Builders",
    description: "Build Your Dream Home",
    images: [
      {
        url: "/images/concept-builders-logo-free-bg.png",
        width: 800,
        height: 600,
        alt: "Concept Builders Logo",
      },
    ],
  },
};


  export default function RootLayout({  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Work+Sans:wght@400;500;700;900"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        />
        <Script src="/track.js" strategy="afterInteractive" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PayPalProviderWrapper>
            <Providers>{children}</Providers>
            <Toaster />
          </PayPalProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
