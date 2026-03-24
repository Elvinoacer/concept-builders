"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Discount, DiscountType } from "@/generated/prisma/browser";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Copy,
  DollarSign,
  Loader2,
  MoreHorizontal,
  Pencil,
  Percent,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DiscountFormState {
  id?: string;
  code: string;
  type: DiscountType;
  value: number;
  minPurchaseAmount: number | null;
  maxUses: number | null;
  expiresAt: string | null;
  isActive: boolean;
  description?: string;
}

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState<Discount[]>([]);
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
    description: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDiscountId, setCurrentDiscountId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [designs, setDesigns] = useState<{ value: string; label: string }[]>(
    []
  );
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | DiscountType>(
    DiscountType.PERCENTAGE
  );
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [activeOperations, setActiveOperations] = useState<Set<string>>(
    new Set()
  );

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
      setFilteredDiscounts(data);
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

  // Filter discounts based on search and filters
  useEffect(() => {
    let filtered = discounts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (discount) =>
          discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          discount.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((discount) =>
        statusFilter === "active" ? discount.isActive : !discount.isActive
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((discount) => discount.type === typeFilter);
    }

    setFilteredDiscounts(filtered);
  }, [searchQuery, statusFilter, typeFilter, discounts]);

  const fetchDesigns = async () => {
    try {
      const res = await fetch("/api/designs");
      if (!res.ok) {
        throw new Error("Failed to fetch designs");
      }
      const data = await res.json();
      setDesigns(
        data.designs.map((d: any) => ({ value: d.id, label: d.name }))
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
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
      description: "",
    });
    setCurrentDiscountId(null);
    setSelectedDesigns([]);
  };

  const generateUniqueCode = () => {
    let newCode = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 8;

    do {
      newCode = "";
      for (let i = 0; i < codeLength; i++) {
        newCode += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
    } while (discounts.some((d) => d.code === newCode));

    setFormState((prev) => ({ ...prev, code: newCode }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Discount code copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.code.trim()) {
      toast.error("Please enter a discount code");
      return;
    }

    const method = formState.id ? "PUT" : "POST";
    const url = formState.id
      ? `/api/admin/discounts?id=${formState.id}`
      : "/api/admin/discounts";

    setIsSubmitting(true);
    setActiveOperations((prev) =>
      new Set(prev).add(formState.id ? `edit-${formState.id}` : "create")
    );

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
      setIsSubmitting(false);
      setActiveOperations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(formState.id ? `edit-${formState.id}` : "create");
        return newSet;
      });
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
        : null,
      isActive: discount.isActive,
      description: discount.description || "",
    });
    setSelectedDesigns(discount.designs?.map((d: any) => d.designId) || []);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!currentDiscountId) return;

    setActiveOperations((prev) =>
      new Set(prev).add(`delete-${currentDiscountId}`)
    );
    try {
      const res = await fetch(`/api/admin/discounts?id=${currentDiscountId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete discount");
      }

      toast.success("Discount deleted successfully!");
      setIsDeleteDialogOpen(false);
      setCurrentDiscountId(null);
      fetchDiscounts();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActiveOperations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`delete-${currentDiscountId}`);
        return newSet;
      });
    }
  };

  const handleToggleActive = async (id: string, newIsActive: boolean) => {
    setActiveOperations((prev) => new Set(prev).add(`toggle-${id}`));
    try {
      const res = await fetch(`/api/admin/discounts?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newIsActive }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to update discount status"
        );
      }

      toast.success(`Discount ${newIsActive ? "activated" : "deactivated"}!`);
      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((d) =>
          d.id === id ? { ...d, isActive: newIsActive } : d
        )
      );
    } catch (err: any) {
      toast.error(err.message);
      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((d) =>
          d.id === id ? { ...d, isActive: !newIsActive } : d
        )
      );
    } finally {
      setActiveOperations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`toggle-${id}`);
        return newSet;
      });
    }
  };

  const getDiscountTypeIcon = (type: DiscountType) => {
    return type === DiscountType.PERCENTAGE ? (
      <Percent className="w-4 h-4" />
    ) : (
      <DollarSign className="w-4 h-4" />
    );
  };

  const getDiscountBadgeVariant = (discount: Discount) => {
    if (!discount.isActive) return "secondary";
    if (discount.expiresAt && new Date(discount.expiresAt) < new Date())
      return "destructive";
    if (discount.maxUses && discount.uses >= discount.maxUses)
      return "destructive";
    return "default";
  };

  const getDiscountStatus = (discount: Discount) => {
    if (!discount.isActive) return "Inactive";
    if (discount.expiresAt && new Date(discount.expiresAt) < new Date())
      return "Expired";
    if (discount.maxUses && discount.uses >= discount.maxUses)
      return "Fully Used";
    return "Active";
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
            </div>
            <div className="flex gap-2 ml-4">
              <div className="w-16 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
    >
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Percent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No Discounts Found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {searchQuery || statusFilter !== "all" || typeFilter !== "all"
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Get started by creating your first discount code to attract more customers."}
      </p>
      {searchQuery || statusFilter !== "all" || typeFilter !== "all" ? (
        <Button
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setTypeFilter("all");
          }}
        >
          Clear Filters
        </Button>
      ) : (
        <Button onClick={() => setIsEditDialogOpen(true)} size="lg">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create First Discount
        </Button>
      )}
    </motion.div>
  );

  // Discount Card Component
  const DiscountCard = ({ discount }: { discount: Discount }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              discount.isActive
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            {getDiscountTypeIcon(discount.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {discount.code}
              </h3>
              <Badge
                variant={getDiscountBadgeVariant(discount)}
                className="text-xs"
              >
                {getDiscountStatus(discount)}
              </Badge>
            </div>
            {discount.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                {discount.description}
              </p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => copyToClipboard(discount.code)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(discount)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleToggleActive(discount.id, !discount.isActive)
              }
            >
              {discount.isActive ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCurrentDiscountId(discount.id);
                setIsDeleteDialogOpen(true);
              }}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Discount Details */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="space-y-1">
          <span className="text-gray-500 dark:text-gray-400">Value</span>
          <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
            {discount.value}
            {discount.type === DiscountType.PERCENTAGE ? "%" : "$"}
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-gray-500 dark:text-gray-400">Usage</span>
          <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
            <Users className="w-3 h-3" />
            {discount.uses}
            {discount.maxUses ? `/${discount.maxUses}` : ""}
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-gray-500 dark:text-gray-400">Min Purchase</span>
          <div className="font-semibold text-gray-900 dark:text-white">
            {discount.minPurchaseAmount
              ? `$${discount.minPurchaseAmount}`
              : "None"}
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-gray-500 dark:text-gray-400">Expires</span>
          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {discount.expiresAt
              ? new Date(discount.expiresAt).toLocaleDateString()
              : "Never"}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(discount.code)}
          className="flex-1"
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(discount)}
          className="flex-1"
        >
          <Pencil className="w-3 h-3 mr-1" />
          Edit
        </Button>
        {activeOperations.has(`toggle-${discount.id}`) ? (
          <Button size="sm" disabled className="flex-1">
            <Loader2 className="w-3 h-3 animate-spin" />
          </Button>
        ) : (
          <Switch
            checked={discount.isActive}
            onCheckedChange={(checked) =>
              handleToggleActive(discount.id, checked)
            }
            className="data-[state=checked]:bg-green-500"
          />
        )}
      </div>
    </motion.div>
  );

  // Grid View
  const GridView = () => (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {filteredDiscounts.map((discount) => (
        <DiscountCard key={discount.id} discount={discount} />
      ))}
    </motion.div>
  );

  // Table View
  const TableView = () => (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min Purchase</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDiscounts.map((discount) => (
              <TableRow key={discount.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {discount.code}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(discount.code)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getDiscountTypeIcon(discount.type)}
                    {discount.type.replace("_", " ")}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">
                    {discount.value}
                    {discount.type === DiscountType.PERCENTAGE ? "%" : "$"}
                  </span>
                </TableCell>
                <TableCell>
                  {discount.minPurchaseAmount
                    ? `$${discount.minPurchaseAmount}`
                    : "None"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {discount.uses}
                    {discount.maxUses ? `/${discount.maxUses}` : ""}
                  </div>
                </TableCell>
                <TableCell>
                  {discount.expiresAt
                    ? new Date(discount.expiresAt).toLocaleDateString()
                    : "Never"}
                </TableCell>
                <TableCell>
                  <Badge variant={getDiscountBadgeVariant(discount)}>
                    {getDiscountStatus(discount)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(discount)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {activeOperations.has(`toggle-${discount.id}`) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Switch
                        checked={discount.isActive}
                        onCheckedChange={(checked) =>
                          handleToggleActive(discount.id, checked)
                        }
                        className="scale-75 data-[state=checked]:bg-green-500"
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Discount Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Manage discount codes and promotions
              </p>
            </div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Discounts
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchDiscounts}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Discount Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Create and manage discount codes for your customers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {filteredDiscounts.length} discount
              {filteredDiscounts.length !== 1 ? "s" : ""}
            </Badge>
            <Button variant="outline" size="sm" onClick={fetchDiscounts}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="min-h-[44px]">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add Discount</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      {formState.id ? "Edit Discount" : "Create New Discount"}
                      <DialogDescription className="mt-1">
                        {formState.id
                          ? "Update the discount code details"
                          : "Create a new discount code for your customers"}
                      </DialogDescription>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                  {/* Code */}
                  <div className="space-y-3">
                    <Label htmlFor="code" className="text-sm font-medium">
                      Discount Code *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="code"
                        name="code"
                        value={formState.code}
                        onChange={handleInputChange}
                        placeholder="SUMMER25"
                        className="flex-1 text-base h-11"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateUniqueCode}
                        className="h-11"
                      >
                        Generate
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formState.description}
                      onChange={handleInputChange}
                      placeholder="Optional description for this discount code..."
                      rows={2}
                      className="resize-vertical text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Type */}
                    <div className="space-y-3">
                      <Label htmlFor="type" className="text-sm font-medium">
                        Discount Type *
                      </Label>
                      <Select
                        value={formState.type}
                        onValueChange={(value: DiscountType) =>
                          handleSelectChange("type", value)
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DiscountType.PERCENTAGE}>
                            <div className="flex items-center gap-2">
                              <Percent className="w-4 h-4" />
                              Percentage
                            </div>
                          </SelectItem>
                          <SelectItem value={DiscountType.FIXED_AMOUNT}>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Fixed Amount
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Value */}
                    <div className="space-y-3">
                      <Label htmlFor="value" className="text-sm font-medium">
                        Value *
                      </Label>
                      <Input
                        id="value"
                        name="value"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formState.value}
                        onChange={handleInputChange}
                        className="h-11 text-base"
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Min Purchase */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="minPurchaseAmount"
                        className="text-sm font-medium"
                      >
                        Minimum Purchase Amount
                      </Label>
                      <Input
                        id="minPurchaseAmount"
                        name="minPurchaseAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formState.minPurchaseAmount || ""}
                        onChange={handleInputChange}
                        className="h-11 text-base"
                        placeholder="No minimum"
                      />
                    </div>

                    {/* Max Uses */}
                    <div className="space-y-3">
                      <Label htmlFor="maxUses" className="text-sm font-medium">
                        Maximum Uses
                      </Label>
                      <Input
                        id="maxUses"
                        name="maxUses"
                        type="number"
                        min="1"
                        value={formState.maxUses || ""}
                        onChange={handleInputChange}
                        className="h-11 text-base"
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Expires At */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="expiresAt"
                        className="text-sm font-medium"
                      >
                        Expiration Date
                      </Label>
                      <Input
                        id="expiresAt"
                        name="expiresAt"
                        type="date"
                        value={formState.expiresAt || ""}
                        onChange={handleDateChange}
                        className="h-11 text-base"
                      />
                    </div>

                    {/* Active Status */}
                    <div className="space-y-3">
                      <Label htmlFor="isActive" className="text-sm font-medium">
                        Status
                      </Label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Switch
                          id="isActive"
                          checked={formState.isActive}
                          onCheckedChange={(checked) =>
                            setFormState((prev) => ({
                              ...prev,
                              isActive: checked,
                            }))
                          }
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {formState.isActive ? "Active" : "Inactive"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formState.isActive
                              ? "Discount is available for use"
                              : "Discount is disabled"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Designs */}
                  <div className="space-y-3">
                    <Label htmlFor="designs" className="text-sm font-medium">
                      Apply to Specific Designs
                    </Label>
                    <MultiSelect
                      options={designs}
                      selected={selectedDesigns}
                      onChange={setSelectedDesigns}
                      placeholder="Select designs (leave empty for all designs)"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Select specific designs this discount applies to. Leave
                      empty to apply to all designs.
                    </p>
                  </div>

                  <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="flex-1 min-h-[48px] order-2 sm:order-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 min-h-[48px] order-1 sm:order-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {formState.id ? "Saving..." : "Creating..."}
                        </>
                      ) : (
                        <>{formState.id ? "Save Changes" : "Create Discount"}</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search discount codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-11 text-base"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(value: any) => setStatusFilter(value)}
              >
                <SelectTrigger className="h-11 min-w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select
                value={typeFilter}
                onValueChange={(value: any) => setTypeFilter(value)}
              >
                <SelectTrigger className="h-11 min-w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={DiscountType.PERCENTAGE}>
                    Percentage
                  </SelectItem>
                  <SelectItem value={DiscountType.FIXED_AMOUNT}>
                    Fixed Amount
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-9 px-3"
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </Button>
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-9 px-3"
                >
                  <div className="w-4 h-4 flex flex-col gap-0.5">
                    <div className="bg-current h-1 rounded-sm"></div>
                    <div className="bg-current h-1 rounded-sm"></div>
                    <div className="bg-current h-1 rounded-sm"></div>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400 self-center">
                Active filters:
              </span>
              {searchQuery && (
                <Badge variant="secondary" className="text-sm">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="text-sm">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {typeFilter !== "all" && (
                <Badge variant="secondary" className="text-sm">
                  Type: {typeFilter.replace("_", " ")}
                  <button
                    onClick={() => setTypeFilter("all")}
                    className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredDiscounts.length === 0 ? (
            <EmptyState />
          ) : viewMode === "grid" ? (
            <GridView />
          ) : (
            <TableView />
          )}
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  Confirm Deletion
                  <DialogDescription className="mt-1">
                    Are you sure you want to delete this discount code? This
                    action cannot be undone.
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 min-h-[44px] order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={activeOperations.has(`delete-${currentDiscountId}`)}
                className="flex-1 min-h-[44px] order-1 sm:order-2"
              >
                {activeOperations.has(`delete-${currentDiscountId}`) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Discount
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DiscountsPage;
