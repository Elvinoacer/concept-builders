"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MarqueeItem } from "@/generated/prisma";

const MarqueeManagement = () => {
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarqueeItem | null>(null);
  const [formData, setFormData] = useState({
    content: '',
  });

  const fetchMarqueeItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/marquee-items');
      if (!response.ok) {
        throw new Error('Failed to fetch marquee items');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/admin/marquee-items/${editingItem.id}` : '/api/admin/marquee-items';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save marquee item');
      }

      toast.success(editingItem ? 'Marquee item updated successfully!' : 'Marquee item added successfully!');
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ content: '' });
      fetchMarqueeItems(); // Re-fetch items to update the list
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this marquee item?')) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/marquee-items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete marquee item');
      }

      toast.success('Marquee item deleted successfully!');
      fetchMarqueeItems(); // Re-fetch items to update the list
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ content: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MarqueeItem) => {
    setEditingItem(item);
    setFormData({ content: item.content });
    setIsModalOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marquee Content Management</CardTitle>
        <CardDescription>Add, edit, or delete items for the homepage marquee.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={openAddModal} className="mb-4">Add New Marquee Item</Button>

        {loading && <p>Loading marquee items...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="grid grid-cols-1 gap-4">
          {marqueeItems.map((item) => (
            <Card key={item.id} className="p-4 flex items-center justify-between">
              <p className="font-medium flex-grow">{item.content}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(item)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Marquee Item' : 'Add New Marquee Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEditItem} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Input id="content" value={formData.content} onChange={handleInputChange} required />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MarqueeManagement;
