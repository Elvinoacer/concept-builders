import { Metadata, ResolvingMetadata } from "next";
import prisma from "@/lib/prisma";

type Props = {
  params: { id: string };
};

async function getDesign(id: string) {
  const design = await prisma.design.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });
  return design;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const design = await getDesign(id);
  console.log('design from generateMetadata', design);

  if (!design) {
    return {
      title: "Design Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const newImages = design.images.map((image) => ({
    url: image.url,
    width: 1200,
    height: 630,
    alt: design.name,
  }));

  return {
    title: design.name,
    description: design.description,
    openGraph: {
      title: design.name,
      description: design.description || "Check out this amazing design!",
      images: [...newImages, ...previousImages],
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
