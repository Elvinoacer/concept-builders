"use client";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Send,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Tag,
} from "lucide-react";
import GlassCard from "@/components/ui-premium/glass-card";
import GoldButton from "@/components/ui-premium/gold-button";
import { cn } from "@/lib/utils";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Establishing secure connection...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Transmission successful", { id: toastId });
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error("Transmission failed. Please retry.", { id: toastId });
      }
    } catch (error) {
      toast.error("Network instability detected.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <GlassCard className="p-12 text-center" hover={false}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
            Transmission Received
          </h2>
          <p className="text-cream-dim max-w-sm mx-auto mb-10 font-medium leading-relaxed">
            Your inquiry has been logged in our executive queue. A specialist
            will reach out shortly.
          </p>
          <GoldButton onClick={() => setSubmitted(false)}>
            Send Another Protocol
          </GoldButton>
        </motion.div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8 sm:p-12" hover={false}>
      <div className="mb-12">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
          Executive Inquiry
        </h2>
        <p className="text-cream-dim font-medium">
          Deploy your requirements to our strategic consulting division.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-1">
              Clearance Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full bg-black/40 backdrop-blur-md border-2 border-cb-border focus:border-gold/50 focus:bg-black/60 rounded-2xl py-4 pl-12 pr-6 text-cream placeholder:text-cream/30 outline-none transition-all duration-300 font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-1">
              Contact Channel
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="w-full bg-black/40 backdrop-blur-md border-2 border-cb-border focus:border-gold/50 focus:bg-black/60 rounded-2xl py-4 pl-12 pr-6 text-cream placeholder:text-cream/30 outline-none transition-all duration-300 font-medium"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phone */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-1">
              Direct Line
            </label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full bg-black/40 backdrop-blur-md border-2 border-cb-border focus:border-gold/50 focus:bg-black/60 rounded-2xl py-4 pl-12 pr-6 text-cream placeholder:text-cream/30 outline-none transition-all duration-300 font-medium"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-1">
              Mission Objective
            </label>
            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Inquiry Topic"
                className="w-full bg-black/40 backdrop-blur-md border-2 border-cb-border focus:border-gold/50 focus:bg-black/60 rounded-2xl py-4 pl-12 pr-6 text-cream placeholder:text-cream/30 outline-none transition-all duration-300 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gold uppercase tracking-[0.2em] ml-1">
            Detailed Briefing
          </label>
          <div className="relative group">
            <MessageSquare className="absolute left-4 top-6 w-4 h-4 text-gold/40 group-focus-within:text-gold transition-colors" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Outline your requirements..."
              className="w-full bg-black/40 backdrop-blur-md border-2 border-cb-border focus:border-gold/50 focus:bg-black/60 rounded-2xl py-5 pl-12 pr-6 text-cream placeholder:text-cream/30 outline-none transition-all duration-300 font-medium resize-none"
            />
          </div>
        </div>

        <div className="pt-6">
          <GoldButton
            type="submit"
            className="w-full h-16 group"
            disabled={loading}
            icon={
              <Send className={cn("w-5 h-5", loading && "animate-pulse")} />
            }
          >
            {loading ? "Transmitting..." : "Initiate Consultation"}
          </GoldButton>
        </div>

        <p className="text-center text-[10px] font-black text-gold/40 uppercase tracking-[0.2em]">
          All data encrypted via secure executive protocols
        </p>
      </form>
    </GlassCard>
  );
};

export default ContactForm;
