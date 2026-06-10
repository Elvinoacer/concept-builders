"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FiEdit, FiTrash } from "react-icons/fi";
import type { AdminCollection } from "./CollectionUpsertModal";

export default function CollectionCard({
  collection,
  onToggleActive,
  onDelete,
  disabled,
}: {
  collection: AdminCollection;
  onToggleActive: (active: boolean) => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm lg:hidden">
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
          <Image src={collection.image} alt={collection.title} fill sizes="64px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/admin/collections/${collection.id}/edit`} className="font-semibold hover:underline">{collection.title}</Link>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{collection.category?.name || "No Category"}</Badge>
            <Badge variant={collection.active ? "default" : "outline"}>{collection.active ? "Active" : "Inactive"}</Badge>
            <Badge variant="outline">Order {collection.order}</Badge>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <Switch checked={collection.active} onCheckedChange={onToggleActive} disabled={disabled} />
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><Link href={`/admin/collections/${collection.id}/edit`}><FiEdit className="mr-2" />Edit</Link></Button>
          <Button variant="destructive" size="sm" onClick={onDelete} disabled={disabled}><FiTrash className="mr-2" />Delete</Button>
        </div>
      </div>
    </div>
  );
}
