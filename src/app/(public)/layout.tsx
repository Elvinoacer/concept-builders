import { headers } from "next/headers";
import PublicShell from "@/components/public/PublicShell";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerStore = await headers();
  const pathname =
    headerStore.get("x-pathname") ?? headerStore.get("next-url") ?? "";
  const hideSharedChrome = pathname === "/" || pathname.startsWith("/auth");

  return (
    <PublicShell hideSharedChrome={hideSharedChrome}>{children}</PublicShell>
  );
}
