import prisma from "@/lib/prisma";
import Link from "next/link";
import CollectionUpsertModal from "@/components/admin/collections/CollectionUpsertModal";

export default async function NewCollectionPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/collections" className="text-sm text-muted-foreground hover:text-foreground">← Back to collections</Link>
        <h1 className="mt-2 text-2xl font-bold">New Collection</h1>
        <p className="text-sm text-muted-foreground">Create a landing page design collection.</p>
      </div>
      <CollectionUpsertModal categories={categories} />
    </div>
  );
}
