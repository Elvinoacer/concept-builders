import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import CollectionUpsertModal from "@/components/admin/collections/CollectionUpsertModal";

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [collection, categories] = await Promise.all([
    prisma.designCollection.findUnique({ where: { id }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!collection) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/collections" className="text-sm text-muted-foreground hover:text-foreground">← Back to collections</Link>
        <h1 className="mt-2 text-2xl font-bold">Edit Collection</h1>
        <p className="text-sm text-muted-foreground">Update {collection.title}.</p>
      </div>
      <CollectionUpsertModal collection={collection} categories={categories} />
    </div>
  );
}
