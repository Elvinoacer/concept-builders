"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FiEdit, FiPlus, FiSearch, FiTrash } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import CollectionCard from "@/components/admin/collections/CollectionCard";
import type { AdminCollection } from "@/components/admin/collections/CollectionUpsertModal";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const fetchCollections = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/collections?search=${encodeURIComponent(debouncedSearch)}&page=${currentPage}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch collections");
      const data = await response.json();
      setCollections(data.collections || []);
      setTotalPages(data.totalPages || 1);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch collections");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const updateCollection = async (collection: AdminCollection, data: Partial<AdminCollection>) => {
    const original = collections;
    setCollections((prev) => prev.map((item) => (item.id === collection.id ? { ...item, ...data } : item)));
    setLoadingStates((prev) => ({ ...prev, [collection.id]: true }));
    try {
      const response = await fetch(`/api/admin/collections/${collection.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to update collection");
      }
      toast.success("Collection updated successfully.");
      fetchCollections();
    } catch (error: unknown) {
      setCollections(original);
      toast.error(error instanceof Error ? error.message : "Failed to update collection");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [collection.id]: false }));
    }
  };

  const deleteCollection = (collection: AdminCollection) => {
    toast.warning("Are you sure you want to delete this collection?", {
      description: "This landing page collection will be permanently removed.",
      action: {
        label: "Yes, Delete",
        onClick: async () => {
          setLoadingStates((prev) => ({ ...prev, [collection.id]: true }));
          try {
            const response = await fetch(`/api/admin/collections/${collection.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete collection");
            toast.success("Collection deleted successfully.");
            fetchCollections();
          } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to delete collection");
          } finally {
            setLoadingStates((prev) => ({ ...prev, [collection.id]: false }));
          }
        },
      },
      cancel: { label: "No, Cancel" },
    });
  };

  const changeOrder = (collection: AdminCollection, delta: number) => {
    updateCollection(collection, { order: Math.max(0, collection.order + delta) } as Partial<AdminCollection>);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Design Collections</h1>
          <p className="text-sm text-muted-foreground">Manage the collection cards shown in Design Ideas.</p>
        </div>
        <Button asChild><Link href="/admin/collections/new"><FiPlus className="mr-2" />New Collection</Link></Button>
      </div>

      <div className="relative max-w-md">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search collections..." className="pl-9" />
      </div>

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center"><CgSpinner className="animate-spin text-3xl text-primary" /></div>
      ) : collections.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <h2 className="text-lg font-semibold">No collections found</h2>
          <p className="mt-2 text-sm text-muted-foreground">Create your first collection to populate the landing page.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-lg border border-border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell><div className="relative h-14 w-14 overflow-hidden rounded-md bg-muted"><Image src={collection.image} alt={collection.title} fill sizes="56px" className="object-cover" /></div></TableCell>
                    <TableCell><Link href={`/admin/collections/${collection.id}/edit`} className="font-semibold hover:underline">{collection.title}</Link><p className="line-clamp-1 text-xs text-muted-foreground">{collection.subtitle || collection.description}</p></TableCell>
                    <TableCell><Badge variant="secondary">{collection.category?.name || "No Category"}</Badge></TableCell>
                    <TableCell><Switch checked={collection.active} disabled={loadingStates[collection.id]} onCheckedChange={(active) => updateCollection(collection, { active } as Partial<AdminCollection>)} /></TableCell>
                    <TableCell><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => changeOrder(collection, -1)} disabled={loadingStates[collection.id]}>↑</Button><span className="w-8 text-center text-sm">{collection.order}</span><Button variant="outline" size="sm" onClick={() => changeOrder(collection, 1)} disabled={loadingStates[collection.id]}>↓</Button></div></TableCell>
                    <TableCell><div className="flex justify-end gap-2"><Button asChild variant="outline" size="sm"><Link href={`/admin/collections/${collection.id}/edit`}><FiEdit /></Link></Button><Button variant="destructive" size="sm" onClick={() => deleteCollection(collection)} disabled={loadingStates[collection.id]}><FiTrash /></Button></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 lg:hidden">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} disabled={loadingStates[collection.id]} onToggleActive={(active) => updateCollection(collection, { active } as Partial<AdminCollection>)} onDelete={() => deleteCollection(collection)} />
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} /></PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index + 1}><PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1} className="cursor-pointer">{index + 1}</PaginationLink></PaginationItem>
            ))}
            <PaginationItem><PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} /></PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
