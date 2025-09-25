import { Toaster } from "sonner";
import { SearchProvider } from "@/lib/SearchContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <Header />
      <main>{children}</main>
      <Toaster />
      <Footer />
    </SearchProvider>
  );
}
