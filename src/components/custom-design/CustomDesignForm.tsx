"use client";
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUploadPreview from "./FileUploadPreview";
import { UploadCloud } from "lucide-react";

const CustomDesignForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designType, setDesignType] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("designType", designType);
    formData.append("description", description);
    if (phone) formData.append("phone", phone);
    if (budget) formData.append("budget", budget);
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/custom-design", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit request");
      }

      toast.success(
        "Custom design request submitted successfully! We will contact you soon."
      );
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setDesignType("");
      setDescription("");
      setBudget("");
      setFiles([]);
      router.push("/"); // Redirect to home or a thank you page
    } catch (error: any) {
      console.error("Error submitting custom design request:", error);
      toast.error(error.message || "Failed to submit custom design request.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleFileRemove = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files) {
        setFiles((prevFiles) => [
          ...prevFiles,
          ...Array.from(e.dataTransfer.files),
        ]);
      }
    },
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            type="tel"
            id="phone"
            placeholder="+1 234 567 8900"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="designType">Type of Design</Label>
          <Select value={designType} onValueChange={setDesignType} required>
            <SelectTrigger>
              <SelectValue placeholder="Select design type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Renovation">Renovation</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="description">Project Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your project in detail, including your vision, requirements, and any specific features you'd like."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />
        </div>
        <div>
          <Label htmlFor="budget">Estimated Budget (Optional)</Label>
          <Input
            type="text"
            id="budget"
            placeholder="e.g., $50,000 - $100,000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="file-upload">Attachments (Optional)</Label>
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
              isDragOver
                ? "border-primary bg-primary/10"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="space-y-1 text-center">
              <UploadCloud
                className={`mx-auto h-8 w-8 md:h-12 md:w-12 ${
                  isDragOver ? "text-primary" : "text-gray-400"
                }`}
              />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                >
                  <span>Upload files</span>
                  <Input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    multiple
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF, PDF, DOCX up to 10MB
              </p>
            </div>
          </div>
          {files.length > 0 && (
            <FileUploadPreview files={files} onRemove={handleFileRemove} />
          )}
        </div>
        <div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-700 hover:to-cyan-500"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CustomDesignForm;
