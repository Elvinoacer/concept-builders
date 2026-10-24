import type { Metadata } from "next";
import { getPublicDesignDetail } from "@/lib/public-design-detail";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const design = await getPublicDesignDetail(id);
  if (!design) return { title: "Design not found" };
  return {
    title: design.name,
    description: design.description,
    openGraph: {
      title: design.name,
      description: design.description,
      images: design.images
        .filter((image) => image.type === "IMAGE")
        .map((image) => ({
          url: image.url,
          width: 1200,
          height: 630,
          alt: design.name,
        })),
    },
  };
}
export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
