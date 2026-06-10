"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

  useEffect(() => {
    const inspiredBy = searchParams.get("inspired_by");
    const style = searchParams.get("style");
    const beds = searchParams.get("beds");

    if (inspiredBy) {
      setDescription((prev) =>
        prev
          ? prev
          : `I would like a custom design inspired by plan ID: ${inspiredBy}.`,
      );
      setDesignType("Residential");
    } else if (style || beds) {
      const styleText = style ? ` in ${style} style` : "";
      const bedText = beds ? ` with ${beds} bedrooms` : "";
      setDescription((prev) =>
        prev
          ? prev
          : `I'm interested in a custom design${styleText}${bedText}.`,
      );
      setDesignType("Residential");
    }
  }, [searchParams]);

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

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!designType) {
      toast.error("Please select a design type.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please provide a project description.");
      return;
    }

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
        "Custom design request submitted successfully! We will contact you soon.",
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
        id="custom-design-form"
        onSubmit={handleSubmit}
        className="space-y-6 sm:space-y-8"
      >
        <div className="grid grid-cols-1 gap-4 border border-cb-border bg-surface p-4 sm:grid-cols-2 sm:gap-5 sm:p-6">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-[11px] uppercase tracking-[0.14em] text-cream-dim"
            >
              Full Name
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11 border-cb-border bg-card text-cream focus:border-gold focus:ring-2 focus:ring-gold/40"
            />

            <p className="mt-1 text-xs text-cream-dim">Enter your full name.</p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[11px] uppercase tracking-[0.14em] text-cream-dim"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 border-cb-border bg-card text-cream focus:border-gold focus:ring-2 focus:ring-gold/40"
            />

            <p className="mt-1 text-xs text-cream-dim">
              We'll use this to contact you about your project.
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-[11px] uppercase tracking-[0.14em] text-cream-dim"
            >
              Phone Number (Optional)
            </Label>
            <Input
              type="tel"
              id="phone"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 border-cb-border bg-card text-cream focus:border-gold focus:ring-2 focus:ring-gold/40"
            />

            <p className="mt-1 text-xs text-cream-dim">
              Optional but recommended.
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="designType"
              className="text-[11px] uppercase tracking-[0.14em] text-cream-dim"
            >
              Type of Design
            </Label>
            <Select value={designType} onValueChange={setDesignType} required>
              <SelectTrigger className="h-11 border-cb-border bg-card text-cream data-[placeholder]:text-muted focus:border-gold">
                <SelectValue placeholder="Select design type" />
              </SelectTrigger>
              <SelectContent className="border-cb-border bg-card text-cream">
                <SelectItem
                  value="Residential"
                  className="focus:bg-gold/15 focus:text-gold"
                >
                  Residential
                </SelectItem>
                <SelectItem
                  value="Commercial"
                  className="focus:bg-gold/15 focus:text-gold"
                >
                  Commercial
                </SelectItem>
                <SelectItem
                  value="Renovation"
                  className="focus:bg-gold/15 focus:text-gold"
                >
                  Renovation
                </SelectItem>
                <SelectItem
                  value="Other"
                  className="focus:bg-gold/15 focus:text-gold"
                >
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label
              htmlFor="description"
              className="text-[11px] uppercase tracking-[0.14em] text-cream-dim"
            >
              Project Description
            </Label>
            <Textarea
              id="description"
              placeholder="Tell us about your project requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="min-h-[150px] resize-y border-cb-border bg-card text-cream focus:border-gold focus:ring-2 focus:ring-gold/40"
              required
            />

            <p className="mt-1 text-xs text-cream-dim">
              Include style preferences, room requirements and project goals.
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label
              htmlFor="budget"
              className="text-[11px] uppercase tracking-[0.14em] text-cream-dim"
            >
              Estimated Budget (Optional)
            </Label>
            <Input
              type="text"
              id="budget"
              placeholder="Estimated budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="h-11 border-cb-border bg-card text-cream placeholder:text-muted focus:border-gold"
            />
          </div>
        </div>

        <div className="border border-dashed border-cb-border bg-surface p-4 sm:p-6">
          <Label
            htmlFor="file-upload"
            className="mb-3 block text-[11px] uppercase tracking-[0.14em] text-cream-dim"
          >
            Attachments (Optional)
          </Label>
          <div
            className={`flex justify-center border border-dashed p-5 sm:p-7 transition-colors ${
              isDragOver
                ? "border-gold bg-gold/10"
                : "border-cb-border bg-card/40 hover:border-gold/40"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="space-y-3 text-center">
              <UploadCloud
                className={`mx-auto h-8 w-8 ${isDragOver ? "text-gold" : "text-muted"}`}
              />
              <div className="space-y-1 text-xs sm:text-sm text-cream-dim">
                <label
                  htmlFor="file-upload"
                  className="inline-flex cursor-pointer items-center justify-center border border-gold/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-gold transition-colors hover:bg-gold hover:text-ink"
                >
                  Upload Files
                  <Input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    multiple
                  />
                </label>
                <p className="text-xs text-muted">or drag and drop here</p>
              </div>
              <p className="text-xs text-muted">
                PNG, JPG, GIF, PDF, DOCX up to 10MB
              </p>
            </div>
          </div>
          {files.length > 0 && (
            <div className="mt-4">
              <FileUploadPreview files={files} onRemove={handleFileRemove} />
            </div>
          )}
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            className="w-full min-h-[52px] border border-gold bg-gold text-sm uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:bg-gold-light"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2 h-4 w-4 rounded-full border-2 border-ink border-t-transparent"
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
