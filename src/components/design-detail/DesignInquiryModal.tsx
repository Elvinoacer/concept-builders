"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CgSpinner } from "react-icons/cg";
import { FiMessageSquare } from "react-icons/fi";

interface DesignInquiryModalProps {
  designId: string;
  designName: string;
}

export default function DesignInquiryModal({
  designId,
  designName,
}: DesignInquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "GENERAL",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/designs/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          designId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit inquiry");
      }

      toast.success(
        "Inquiry submitted successfully! We will get back to you within 2 hours."
      );
      setIsOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "GENERAL",
        message: "",
      });
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      toast.error(error.message || "Failed to submit inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gold hover:bg-gold-light text-ink font-black py-8 text-xl shadow-2xl shadow-gold/20 transition-all active:scale-[0.98] rounded-xl border border-gold/20 uppercase tracking-widest">
          <FiMessageSquare className="mr-3 h-6 w-6" />
          Leave a message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-card border-2 border-cb-border shadow-2xl p-0 overflow-hidden rounded-3xl">
        <div className="bg-ink p-6 border-b border-cb-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gold uppercase tracking-tight">Inquire about {designName}</DialogTitle>
            <DialogDescription className="text-cream-dim text-base font-medium mt-2">
              Have questions or want to negotiate? Send us a message and we'll get
              back to you shortly.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold text-gold uppercase tracking-widest">Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                className="bg-surface border-2 border-cb-border focus:border-gold focus:ring-gold rounded-xl py-6 text-cream font-medium placeholder:text-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-bold text-gold uppercase tracking-widest">Phone</Label>
              <Input
                id="phone"
                required
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1 234 567 890"
                className="bg-surface border-2 border-cb-border focus:border-gold focus:ring-gold rounded-xl py-6 text-cream font-medium placeholder:text-muted"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold text-gold uppercase tracking-widest">Email</Label>
            <Input
              id="email"
              required
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@example.com"
              className="bg-surface border-2 border-cb-border focus:border-gold focus:ring-gold rounded-xl py-6 text-cream font-medium placeholder:text-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiryType" className="text-sm font-bold text-gold uppercase tracking-widest">Inquiry Type</Label>
            <Select
              value={formData.inquiryType}
              onValueChange={(value) =>
                setFormData({ ...formData, inquiryType: value })
              }
            >
              <SelectTrigger className="bg-surface border-2 border-cb-border focus:border-gold focus:ring-gold rounded-xl py-6 text-cream font-medium">
                <SelectValue placeholder="Select inquiry type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-cb-border">
                <SelectItem value="GENERAL" className="text-cream focus:bg-surface focus:text-gold cursor-pointer py-3">General Inquiry</SelectItem>
                <SelectItem value="NEGOTIATION" className="text-cream focus:bg-surface focus:text-gold cursor-pointer py-3">Price Negotiation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-bold text-gold uppercase tracking-widest">Message</Label>
            <Textarea
              id="message"
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="I'm interested in this design..."
              className="min-h-[120px] bg-surface border-2 border-cb-border focus:border-gold focus:ring-gold rounded-xl p-4 text-cream font-medium placeholder:text-muted resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gold hover:bg-gold-light text-ink font-black py-8 text-xl shadow-2xl shadow-gold/20 rounded-xl transition-all active:scale-[0.98] uppercase tracking-widest mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CgSpinner className="mr-3 h-6 w-6 animate-spin" />
                Processing...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
