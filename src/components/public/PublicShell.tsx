"use client";

import { usePathname } from "next/navigation";
import { SearchProvider } from "@/lib/SearchContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FloatingCartButton from "@/components/cart/FloatingCartButton";

export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const hideSharedChrome = pathname === "/" || pathname.startsWith("/auth");

  if (hideSharedChrome) {
    return (
      <SearchProvider>
        <main className="w-full">{children}</main>
      </SearchProvider>
    );
  }

  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <FloatingCartButton />
        <Footer />
      </div>
    </SearchProvider>
  );
}
