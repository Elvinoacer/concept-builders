import { SearchProvider } from "@/lib/SearchContext";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const FloatingCartButton = dynamic(() => import("@/components/cart/FloatingCartButton"), {
  ssr: false, // We can disable SSR for this as it's purely client-side interaction
});
// removed ThemeProvider

export default function PublicShell({
  children,
  hideSharedChrome,
}: {
  children: React.ReactNode;
  hideSharedChrome: boolean;
}) {
  if (hideSharedChrome) {
    return <main className="w-full">{children}</main>;
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
