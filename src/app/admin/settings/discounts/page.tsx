"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { DiscountType, Discount } from "@/generated/prisma";
import { MultiSelect } from "@/components/ui/multi-select";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface DiscountFormState {
  id?: string;
  code: string;
  type: DiscountType;
  value: number;
  minPurchaseAmount: number | null;
  maxUses: number | null;
  expiresAt: string | null;
  isActive: boolean;
}

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<DiscountFormState>({
    code: "",
    type: DiscountType.PERCENTAGE,
    value: 0,
    minPurchaseAmount: null,
    maxUses: null,
    expiresAt: null,
    isActive: true,
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDiscountId, setCurrentDiscountId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading spinner
  const [designs, setDesigns] = useState<{ value: string; label: string }[]>([]);
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([]);

  const fetchDiscounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/discounts");
      if (!res.ok) {
        throw new Error("Failed to fetch discounts");
      }
      const data: Discount[] = await res.json();
      setDiscounts(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const res = await fetch("/api/designs");
      if (!res.ok) {
        throw new Error("Failed to fetch designs");
      }
      const data = await res.json();
      setDesigns(data.designs.map((d: any) => ({ value: d.id, label: d.name })));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: keyof DiscountFormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      expiresAt: e.target.value || null,
    }));
  };

  const resetForm = () => {
    setFormState({
      code: "",
      type: DiscountType.PERCENTAGE,
      value: 0,
      minPurchaseAmount: null,
      maxUses: null,
      expiresAt: null,
      isActive: true,
    });
    setCurrentDiscountId(null);
    setSelectedDesigns([]);
  };

  const generateUniqueCode = () => {
    let newCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 8; // You can adjust the length

    do {
      newCode = '';
      for (let i = 0; i < codeLength; i++) {
        newCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    } while (discounts.some(d => d.code === newCode)); // Ensure uniqueness against existing codes

    setFormState(prev => ({ ...prev, code: newCode }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = formState.id ? "PUT" : "POST";
    const url = formState.id
      ? `/api/admin/discounts?id=${formState.id}`
      : "/api/admin/discounts";

    setIsSubmitting(true); // Set submitting state to true
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          value: parseFloat(formState.value.toString()),
          minPurchaseAmount: formState.minPurchaseAmount
            ? parseFloat(formState.minPurchaseAmount.toString())
            : null,
          maxUses: formState.maxUses
            ? parseInt(formState.maxUses.toString())
            : null,
          expiresAt: formState.expiresAt
            ? new Date(formState.expiresAt).toISOString()
            : null,
          designIds: selectedDesigns,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save discount");
      }

      toast.success(
        `Discount ${formState.id ? "updated" : "created"} successfully!`
      );
      resetForm();
      setIsEditDialogOpen(false);
      fetchDiscounts();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleEdit = (discount: any) => {
    setFormState({
      id: discount.id,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      minPurchaseAmount: discount.minPurchaseAmount || null,
      maxUses: discount.maxUses || null,
      expiresAt: discount.expiresAt
        ? new Date(discount.expiresAt).toISOString().split("T")[0]
        : null, // Format for input type=date
      isActive: discount.isActive,
    });
    setSelectedDesigns(discount.designs.map((d: any) => d.designId));
    setIsEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!currentDiscountId) return;

    try {
      const res = await fetch(`/api/admin/discounts?id=${currentDiscountId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete discount");
      }
      }

      toast.success("Discount deleted successfully!");
      setIsDeleteDialogOpen(false);
      setCurrentDiscountId(null);
      fetchDiscounts();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggleActive = async (id: string, newIsActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/discounts?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newIsActive }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update discount status');
      }

      toast.success(`Discount status updated to ${newIsActive ? 'active' : 'inactive'}!`);
      // Optimistically update the UI or refetch
      setDiscounts(prevDiscounts =>
        prevDiscounts.map(d => (d.id === id ? { ...d, isActive: newIsActive } : d))
      );
    } catch (err: any) {
      toast.error(err.message);
      // Revert UI if update failed
      setDiscounts(prevDiscounts =>
        prevDiscounts.map(d => (d.id === id ? { ...d, isActive: !newIsActive } : d))
      )
    }
  };

  if (loading) return <div className="p-8">Loading discounts...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Discount Management</h1>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={resetForm} className="mb-6">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Discount
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {formState.id ? "Edit Discount" : "Add New Discount"}
            </DialogTitle>
            <DialogDescription>
              {formState.id
                ? "Edit the details of the discount."
                : "Create a new discount code."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="md:text-right">
                Code
              </Label>
              <div className="md:col-span-3 flex items-center gap-2">
                <Input
                  id="code"
                  name="code"
                  value={formState.code}
                  onChange={handleInputChange}
                  className="flex-grow"
                  required
                />
                <Button type="button" variant="outline" onClick={generateUniqueCode}>
                  Generate
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="md:text-right">
                Type
              </Label>
              <Select
                name="type"
                value={formState.type}
                onValueChange={(value: DiscountType) =>
                  handleSelectChange("type", value)
                }
              >
                <SelectTrigger className="md:col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DiscountType.PERCENTAGE}>
                    Percentage
                  </SelectItem>
                  <SelectItem value={DiscountType.FIXED_AMOUNT}>
                    Fixed Amount
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="md:text-right">
                Value
              </Label>
              <Input
                id="value"
                name="value"
                type="number"
                step="0.01"
                value={formState.value}
                onChange={handleInputChange}
                className="md:col-span-3"
                required
              />
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="minPurchaseAmount" className="md:text-right">
                Min Purchase
              </Label>
              <Input
                id="minPurchaseAmount"
                name="minPurchaseAmount"
                type="number"
                step="0.01"
                value={formState.minPurchaseAmount || ""}
                onChange={handleInputChange}
                className="md:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="maxUses" className="md:text-right">
                Max Uses
              </Label>
              <Input
                id="maxUses"
                name="maxUses"
                type="number"
                value={formState.maxUses || ""}
                onChange={handleInputChange}
                className="md:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="expiresAt" className="md:text-right">
                Expires At
              </Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="date"
                value={formState.expiresAt || ""}
                onChange={handleDateChange}
                className="md:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="md:text-right">
                Active
              </Label>
              <Switch
                id="isActive"
                name="isActive"
                checked={formState.isActive}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, isActive: checked }))
                }
                className="md:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="designs" className="md:text-right">
                Apply to Designs
              </Label>
              <div className="md:col-span-3">
                <MultiSelect
                  options={designs}
                  selected={selectedDesigns}
                  onChange={setSelectedDesigns}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? (formState.id ? "Saving..." : "Creating...")
                  : (formState.id ? "Save Changes" : "Create Discount")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min Purchase</TableHead>
              <TableHead>Max Uses</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell className="font-medium">{discount.code}</TableCell>
                <TableCell>{discount.type}</TableCell>
                <TableCell>
                  {discount.value}
                  {discount.type === DiscountType.PERCENTAGE ? "%" : "$"}
                </TableCell>
                <TableCell>
                  {discount.minPurchaseAmount
                    ? `$${discount.minPurchaseAmount.toFixed(2)}`
                    : "N/A"}
                </TableCell>
                <TableCell>{discount.maxUses || "Unlimited"}</TableCell>
                <TableCell>{discount.uses}</TableCell>
                <TableCell>
                  {discount.expiresAt
                    ? new Date(discount.expiresAt).toLocaleDateString()
                    : "Never"}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={discount.isActive}
                    onCheckedChange={(checked) => handleToggleActive(discount.id, checked)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(discount)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Dialog
                    open={
                      isDeleteDialogOpen && currentDiscountId === discount.id
                    }
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => setCurrentDiscountId(discount.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete the discount code
                          &quot;{discount.code}&quot;? This action cannot be
                          undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDeleteDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DiscountsPage;
