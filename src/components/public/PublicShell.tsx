import { SearchProvider } from "@/lib/SearchContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FloatingCartButton from "@/components/cart/FloatingCartButton";
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
