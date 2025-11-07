import { Toaster } from "sonner";
import { SearchProvider } from "@/lib/SearchContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Toaster />
        <Footer />
      </div>
    </SearchProvider>
  );
}
