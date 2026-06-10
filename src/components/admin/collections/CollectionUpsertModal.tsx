"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CgSpinner } from "react-icons/cg";

export type AdminCollection = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  image: string;
  categoryId: string | null;
  order: number;
  active: boolean;
  category?: { id: string; name: string } | null;
};

type CategoryOption = { id: string; name: string };

type FormState = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  categoryId: string;
  order: string;
  active: boolean;
};

const initialForm: FormState = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  categoryId: "",
  order: "0",
  active: true,
};

export default function CollectionUpsertModal({
  collection,
  categories,
}: {
  collection?: AdminCollection | null;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!collection) {
      setForm(initialForm);
      return;
    }
    setForm({
      title: collection.title,
      subtitle: collection.subtitle || "",
      description: collection.description,
      image: collection.image,
      categoryId: collection.categoryId || "",
      order: String(collection.order ?? 0),
      active: collection.active,
    });
  }, [collection]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.title.trim() || form.title.trim().length > 100) return "Title is required and must be 100 characters or fewer.";
    if (!form.description.trim() || form.description.trim().length > 500) return "Description is required and must be 500 characters or fewer.";
    try {
      new URL(form.image.trim());
    } catch {
      return "A valid image URL is required.";
    }
    const order = Number(form.order);
    if (!Number.isInteger(order) || order < 0) return "Display order must be an integer greater than or equal to 0.";
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(collection ? `/api/admin/collections/${collection.id}` : "/api/admin/collections", {
        method: collection ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          subtitle: form.subtitle.trim() || null,
          description: form.description.trim(),
          image: form.image.trim(),
          categoryId: form.categoryId || null,
          order: Number(form.order),
          active: form.active,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save collection");
      }

      toast.success(`Collection ${collection ? "updated" : "created"} successfully.`);
      router.push("/admin/collections");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to save collection");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={form.title} maxLength={100} onChange={(e) => updateField("title", e.target.value)} placeholder="Modern Family Collection" disabled={isSaving} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input id="subtitle" value={form.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} placeholder="Homes designed for growing families" disabled={isSaving} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <textarea id="description" value={form.description} maxLength={500} onChange={(e) => updateField("description", e.target.value)} placeholder="Short collection description..." disabled={isSaving} className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          <p className="text-xs text-muted-foreground">{form.description.length}/500 characters</p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image">Image URL *</Label>
          <Input id="image" value={form.image} onChange={(e) => updateField("image", e.target.value)} placeholder="https://..." disabled={isSaving} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select id="categoryId" value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)} disabled={isSaving} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">No Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input id="order" type="number" min={0} step={1} value={form.order} onChange={(e) => updateField("order", e.target.value)} disabled={isSaving} />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 sm:col-span-2">
          <div>
            <Label htmlFor="active">Active</Label>
            <p className="text-sm text-muted-foreground">Show this collection on the landing page.</p>
          </div>
          <Switch id="active" checked={form.active} onCheckedChange={(checked) => updateField("active", checked)} disabled={isSaving} />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/collections")} disabled={isSaving}>Cancel</Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <CgSpinner className="mr-2 animate-spin" />}
          {collection ? "Save Collection" : "Create Collection"}
        </Button>
      </div>
    </form>
  );
}
