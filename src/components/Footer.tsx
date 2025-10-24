"use client";

import Link from "next/link";
import { footerLinks, socialLinks } from "@/lib/dummydata";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setEmail(""); // Clear email on success
      } else {
        toast.error(data.message || "Failed to subscribe.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#F3F4F6] text-[#0B2545] dark:bg-gray-900 dark:text-gray-200">
      <div className="mx-auto max-w-7xl px-4 md:px-10 py-8 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col gap-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/images/concept-builders-logo-free-bg.png"
                alt="Concept Builders Logo"
                width={80}
                height={80}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                Concept Builders
              </span>
            </div>
            <p className="text-[#9CA3AF] text-sm dark:text-gray-400">
              Your partner in building the future. Discover, purchase, and
              actualize your dream home with us.
            </p>
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-4 dark:text-white">
                Subscribe to our newsletter
              </h4>
              <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#26c6da] text-white font-semibold hover:from-blue-700 hover:to-cyan-500 transition-all"
                  disabled={loading}
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            <div>
              <h4 className="text-lg font-semibold mb-4 dark:text-white">
                About Us
              </h4>
              <ul className="space-y-3">
                {footerLinks.about.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-[#9CA3AF] hover:text-[#0B2545] transition-colors dark:text-gray-400 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 dark:text-white">
                Legal & Policy
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-[#9CA3AF] hover:text-[#0B2545] transition-colors dark:text-gray-400 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 dark:text-white">
                Contact Us
              </h4>
              <ul className="space-y-3">
                {footerLinks.contact.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#0B2545] transition-colors dark:text-gray-400 dark:hover:text-white"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {link.icon}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 dark:border-gray-800">
          <p className="text-[#9CA3AF] text-sm dark:text-gray-400">
            © {new Date().getFullYear()} Concept Builders. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-[#9CA3AF] hover:text-[#1193d4] transition-colors dark:text-gray-400 dark:hover:text-primary"
              >
                <link.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
