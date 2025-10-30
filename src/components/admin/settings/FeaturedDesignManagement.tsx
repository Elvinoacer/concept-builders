"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Design } from "@/generated/prisma";

interface DesignWithCategoryAndFiles extends Design {
  category: { name: string } | null;
  files: { url: string }[];
  architecturalDesign?: {
    pdfFiles: { url: string }[];
    cadFiles: { url: string }[];
  } | null;
  structuralDesign?: {
    pdfFiles: { url: string }[];
    cadFiles: { url: string }[];
  } | null;
  billOfQuantities?: {
    excelFiles: { url: string }[];
  } | null;
}

const FeaturedDesignManagement = () => {
  const [designs, setDesigns] = useState<DesignWithCategoryAndFiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalDesigns, setTotalDesigns] = useState(0);

  const fetchDesigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        search: searchQuery,
      });
      const response = await fetch(`/api/admin/designs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch designs');
      }
      const data = await response.json();
      setDesigns(data.designs);
      setTotalDesigns(data.totalCount);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [currentPage, pageSize, searchQuery]);

  

  const updateIsFeatured = async (designId: string, isFeatured: boolean) => {
    // Optimistic UI update
    const originalDesigns = [...designs];
    setDesigns(prevDesigns =>
      prevDesigns.map(design =>
        design.id === designId ? { ...design, isFeatured: isFeatured } : design
      )
    );

    try {
      const response = await fetch(`/api/admin/designs/${designId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update featured status');
      }

      toast.success('Featured status updated successfully!');
      // No need to fetchDesigns() if optimistic update was successful
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      setDesigns(originalDesigns); // Revert on error
    } finally {
      // setLoading(false); // Keep loading true until all operations are done if there are multiple
    }
  };

  const totalPages = Math.ceil(totalDesigns / pageSize);
  const featuredDesigns = designs.filter(d => d.isFeatured);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Design Management</CardTitle>
        <CardDescription>Toggle designs to be featured on the homepage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Currently Featured Designs ({featuredDesigns.length})</h3>
          {featuredDesigns.length === 0 && <p className="text-gray-500">No designs are currently featured.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredDesigns.map(design => (
              <Card key={design.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{design.name}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => updateIsFeatured(design.id, false)}
                  disabled={loading}
                >
                  Unfeature
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Designs</h3>
          <Input
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          {loading && <p>Loading designs...</p>}
          <div className="grid grid-cols-1 gap-4">
            {designs.map(design => (
              <Card key={design.id} className="p-4 flex flex-col sm:flex-row items-center justify-between">
                <div className="flex-1 mb-2 sm:mb-0">
                  <p className="font-medium">{design.name}</p>
                  <p className="text-sm text-gray-500">Category: {design.category?.name || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`isFeatured-${design.id}`}>Featured:</Label>
                  <Input
                    id={`isFeatured-${design.id}`}
                    type="checkbox"
                    checked={design.isFeatured}
                    onChange={() => updateIsFeatured(design.id, !design.isFeatured)}
                    className="w-5 h-5"
                    disabled={loading}
                  />
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedDesignManagement;
