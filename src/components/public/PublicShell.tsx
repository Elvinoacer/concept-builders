import { SearchProvider } from "@/lib/SearchContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FloatingCartButton from "@/components/cart/FloatingCartButton";
import { ThemeProvider } from "@/components/theme-provider";

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
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="concept-builders-theme"
    >
      <SearchProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <FloatingCartButton />
          <Footer />
        </div>
      </SearchProvider>
    </ThemeProvider>
  );
}
