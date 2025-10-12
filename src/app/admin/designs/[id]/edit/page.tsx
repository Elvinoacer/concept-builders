"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const EditDesignPage = () => {
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<{ [key: string]: FileList | null }>({});
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchDesign = async () => {
        try {
          const response = await fetch(`/api/designs/${id}`);
          const data = await response.json();
          setDesign(data);
        } catch (error) {
          console.error("Error fetching design:", error);
          toast.error("Failed to fetch design details.");
        }
        setLoading(false);
      };
      fetchDesign();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDesign((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFiles((prev) => ({ ...prev, [name]: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", design.name);
    formData.append("description", design.description);
    formData.append("basePrice", design.basePrice);

    Object.keys(files).forEach((key) => {
      if (files[key]) {
        for (let i = 0; i < files[key].length; i++) {
          formData.append(key, files[key][i]);
        }
      }
    });

    try {
      const response = await fetch(`/api/designs/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        toast.success("Design updated successfully!");
      } else {
        toast.error("Failed to update design.");
      }
    } catch (error) {
      console.error("Error updating design:", error);
      toast.error("An error occurred while updating the design.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!design) {
    return <div>Design not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8"
    >
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Design</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Design Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={design.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price</Label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  value={design.basePrice}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={design.description}
                onChange={handleInputChange}
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">File Uploads</h3>
              <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <Input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="renderings">Renderings</Label>
                <Input
                  id="renderings"
                  name="renderings"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floorPlanUrl">Floor Plan</Label>
                <Input
                  id="floorPlanUrl"
                  name="floorPlanUrl"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <Button type="submit">Save Changes</Button>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  );
};

export default EditDesignPage;
