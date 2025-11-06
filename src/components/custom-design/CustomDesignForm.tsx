"use client";
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import SuccessModal from "./SuccessModal";

const CustomDesignForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designType, setDesignType] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setDesignType("");
    setDescription("");
    setBudget("");
    setFiles([]);
  };

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
      setIsModalOpen(true);
    } catch (error: any) {
      console.error("Error submitting custom design request:", error);
      toast.error(error.message || "Failed to submit custom design request.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
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

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(e.dataTransfer.files),
      ]);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full max-w-full mx-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-6 md:space-y-8"
      >
        {/* Name & Email Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base">
              Full Name
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm sm:text-base">
            Phone Number (Optional)
          </Label>
          <Input
            type="tel"
            id="phone"
            placeholder="+1 234 567 8900"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
          />
        </div>

        {/* Design Type */}
        <div className="space-y-2">
          <Label htmlFor="designType" className="text-sm sm:text-base">
            Type of Design
          </Label>
          <Select value={designType} onValueChange={setDesignType} required>
            <SelectTrigger className="w-full text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3 h-auto min-h-[42px]">
              <SelectValue placeholder="Select design type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Residential" className="text-sm sm:text-base">
                Residential
              </SelectItem>
              <SelectItem value="Commercial" className="text-sm sm:text-base">
                Commercial
              </SelectItem>
              <SelectItem value="Renovation" className="text-sm sm:text-base">
                Renovation
              </SelectItem>
              <SelectItem value="Other" className="text-sm sm:text-base">
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm sm:text-base">
            Project Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your project in detail, including your vision, requirements, and any specific features you'd like."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full text-sm sm:text-base resize-y min-h-[120px] sm:min-h-[140px] px-3 py-2 sm:px-4 sm:py-3"
            required
          />
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-sm sm:text-base">
            Estimated Budget (Optional)
          </Label>
          <Input
            type="text"
            id="budget"
            placeholder="e.g., $50,000 - $100,000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-upload" className="text-sm sm:text-base">
            Attachments (Optional)
          </Label>
          <div
            className={`mt-1 flex justify-center px-4 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6 border-2 border-dashed rounded-lg transition-colors ${
              isDragOver
                ? "border-primary bg-primary/10"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="space-y-2 sm:space-y-3 text-center">
              <UploadCloud
                className={`mx-auto h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 ${
                  isDragOver ? "text-primary" : "text-gray-400"
                }`}
              />
              <div className="flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1 sm:space-y-0">
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
                <p className="sm:pl-1">or drag and drop</p>
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

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            className="w-full min-h-[48px] text-sm sm:text-base md:text-lg bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-700 hover:to-cyan-500 transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Submitting...
              </span>
            ) : (
              "Submit Request"
            )}
          </Button>
        </div>
      </form>
      <SuccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </motion.div>
  );
};

export default CustomDesignForm;
