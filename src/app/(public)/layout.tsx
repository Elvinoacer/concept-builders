import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
