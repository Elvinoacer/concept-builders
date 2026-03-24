"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MarqueeItem } from "@/generated/prisma/browser";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ChevronRight,
  Edit,
  Eye,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MarqueeManagement = () => {
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarqueeItem | null>(null);
  const [formData, setFormData] = useState({
    content: "",
    isActive: true,
  });
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [activeOperations, setActiveOperations] = useState<Set<string>>(
    new Set()
  );

  const fetchMarqueeItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/marquee-items");
      if (!response.ok) {
        throw new Error("Failed to fetch marquee items");
      }
      const data = await response.json();
      setMarqueeItems(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarqueeItems();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleAddEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      toast.error("Please enter marquee content");
      return;
    }

    setLoading(true);
    setError(null);
    const operationId = editingItem ? `edit-${editingItem.id}` : "add-new";
    setActiveOperations((prev) => new Set(prev).add(operationId));

    const method = editingItem ? "PUT" : "POST";
    const url = editingItem
      ? `/api/admin/marquee-items/${editingItem.id}`
      : "/api/admin/marquee-items";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save marquee item");
      }

      toast.success(
        editingItem
          ? "Marquee item updated successfully!"
          : "Marquee item added successfully!",
        {
          description: "The scrolling text has been updated on the homepage.",
        }
      );
      setIsModalOpen(false);
      resetForm();
      fetchMarqueeItems();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
      setActiveOperations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this marquee item? This action cannot be undone."
      )
    )
      return;

    setActiveOperations((prev) => new Set(prev).add(`delete-${id}`));
    try {
      const response = await fetch(`/api/admin/marquee-items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete marquee item");
      }

      toast.success("Marquee item deleted successfully!");
      fetchMarqueeItems();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setActiveOperations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`delete-${id}`);
        return newSet;
      });
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setActiveOperations((prev) => new Set(prev).add(`toggle-${id}`));
    try {
      const response = await fetch(`/api/admin/marquee-items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentActive }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update marquee item");
      }

      toast.success(
        !currentActive ? "Marquee item activated!" : "Marquee item deactivated!"
      );
      fetchMarqueeItems();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setActiveOperations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`toggle-${id}`);
        return newSet;
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ content: "", isActive: true });
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: MarqueeItem) => {
    setEditingItem(item);
    setFormData({
      content: item.content,
      isActive: item.isActive,
    });
    setIsModalOpen(true);
  };

  const activeItems = marqueeItems.filter((item) => item.isActive);
  const inactiveItems = marqueeItems.filter((item) => !item.isActive);

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2 ml-4">
              <div className="w-10 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
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
        <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No Marquee Items Yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Get started by creating your first scrolling announcement for the
        homepage marquee.
      </p>
      <Button onClick={openAddModal} size="lg" className="min-h-[48px] px-6">
        <Plus className="w-5 h-5 mr-2" />
        Create First Item
      </Button>
    </motion.div>
  );

  // Error State
  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-8 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
    >
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Unable to Load Marquee Items
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
      <Button onClick={fetchMarqueeItems}>Try Again</Button>
    </motion.div>
  );

  // Marquee Item Card
  const MarqueeItemCard = ({ item }: { item: MarqueeItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        {/* Status Indicator */}
        <div
          className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
            item.isActive
              ? "bg-green-500 animate-pulse"
              : "bg-gray-300 dark:bg-gray-600"
          }`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 dark:text-white text-lg font-medium mb-2 line-clamp-2">
            {item.content}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <Badge
              variant={item.isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {item.isActive ? (
                <>
                  <Volume2 className="w-3 h-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 mr-1" />
                  Inactive
                </>
              )}
            </Badge>

            {item.createdAt && (
              <span className="flex items-center gap-1">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </span>
            )}

            {item.updatedAt && item.updatedAt !== item.createdAt && (
              <span className="flex items-center gap-1">
                Updated: {new Date(item.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Active Toggle */}
          {activeOperations.has(`toggle-${item.id}`) ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          ) : (
            <Switch
              checked={item.isActive}
              onCheckedChange={() => handleToggleActive(item.id, item.isActive)}
              className="data-[state=checked]:bg-green-500"
            />
          )}

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditModal(item)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleActive(item.id, item.isActive)}
              >
                {item.isActive ? (
                  <>
                    <VolumeX className="w-4 h-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteItem(item.id)}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Actions - Mobile */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => openEditModal(item)}
          className="flex-1"
          disabled={activeOperations.has(`edit-${item.id}`)}
        >
          {activeOperations.has(`edit-${item.id}`) ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Edit className="w-3 h-3 mr-1" />
          )}
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDeleteItem(item.id)}
          disabled={activeOperations.has(`delete-${item.id}`)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          {activeOperations.has(`delete-${item.id}`) ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Trash2 className="w-3 h-3" />
          )}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Marquee Management
              </CardTitle>
              <CardDescription className="text-base sm:text-lg mt-2">
                Manage scrolling announcements for the homepage marquee
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {activeItems.length} active
              </Badge>
              <Button variant="outline" size="sm" onClick={fetchMarqueeItems}>
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                onClick={openAddModal}
                size="lg"
                className="min-h-[44px] px-4 sm:px-6"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Add Item</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0 space-y-6">
          {/* Preview Toggle */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Live Preview
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Preview how your marquee will appear on the homepage
                    </p>
                  </div>
                </div>
                <Switch
                  checked={previewEnabled}
                  onCheckedChange={setPreviewEnabled}
                />
              </div>

              {/* Preview Display */}
              {previewEnabled && activeItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 bg-gray-900 rounded-xl overflow-hidden"
                >
                  <div className="flex space-x-8 animate-marquee whitespace-nowrap">
                    {activeItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-8"
                      >
                        <span className="text-white text-lg font-medium">
                          {item.content}
                        </span>
                        {index < activeItems.length - 1 && (
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                  <style jsx>{`
                    @keyframes marquee {
                      0% {
                        transform: translateX(100%);
                      }
                      100% {
                        transform: translateX(-100%);
                      }
                    }
                    .animate-marquee {
                      animation: marquee 30s linear infinite;
                    }
                  `}</style>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Active Items Section */}
          {activeItems.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Active Marquee Items
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    These items are currently displayed on the homepage
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {activeItems.map((item) => (
                  <MarqueeItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Inactive Items Section */}
          {inactiveItems.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <VolumeX className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Inactive Marquee Items
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    These items are not currently displayed
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {inactiveItems.map((item) => (
                  <MarqueeItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Loading, Error, and Empty States */}
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : marqueeItems.length === 0 ? (
            <EmptyState />
          ) : null}

          {/* Summary */}
          {marqueeItems.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {marqueeItems.length} total marquee item
                {marqueeItems.length !== 1 ? "s" : ""} • {activeItems.length}{" "}
                active • {inactiveItems.length} inactive
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                {editingItem ? "Edit Marquee Item" : "Add New Marquee Item"}
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
                  {editingItem
                    ? "Update the scrolling announcement"
                    : "Create a new scrolling announcement"}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddEditItem} className="space-y-6">
            {/* Content Input */}
            <div className="space-y-3">
              <Label htmlFor="content" className="text-sm font-medium">
                Marquee Content *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter your announcement text (e.g., 'New designs available! Limited time offer.')"
                rows={4}
                className="resize-vertical min-h-[100px] text-base"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This text will scroll across the homepage. Keep it concise and
                engaging.
              </p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Active Status
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.isActive
                    ? "This item will be displayed in the marquee"
                    : "This item will be hidden from the marquee"}
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>

            {/* Character Count */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Character count: {formData.content.length}
              </span>
              {formData.content.length > 200 && (
                <span className="text-amber-600 dark:text-amber-400">
                  Consider keeping it under 200 characters for best display
                </span>
              )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 min-h-[48px] order-2 sm:order-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.content.trim()}
                className="flex-1 min-h-[48px] order-1 sm:order-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingItem ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{editingItem ? "Update Item" : "Create Item"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MarqueeManagement;
