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
      <div className="mx-auto max-w-7xl px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-6 xs:py-8 sm:py-10 md:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 xs:gap-10 sm:gap-12 md:grid-cols-4 lg:gap-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-3 xs:gap-4 sm:gap-5 md:col-span-1">
            <div className="flex items-center gap-2 xs:gap-3">
              <Image
                src="/images/concept-builders-logo-free-bg.png"
                alt="Concept Builders Logo"
                width={64}
                height={64}
                className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
                priority
              />
              <span className="text-lg xs:text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                Concept Builders
              </span>
            </div>
            <p className="text-[#9CA3AF] text-xs xs:text-sm sm:text-base dark:text-gray-400 leading-relaxed">
              Your partner in building the future. Discover, purchase, and
              actualize your dream home with us.
            </p>

            {/* Newsletter Subscription */}
            <div className="mt-2 xs:mt-3 sm:mt-4">
              <h4 className="text-base xs:text-lg sm:text-xl font-semibold mb-2 xs:mb-3 sm:mb-4 dark:text-white">
                Subscribe to our newsletter
              </h4>
              <form
                className="flex flex-col gap-2 xs:gap-3"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm xs:text-base placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 text-sm xs:text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      Subscribing...
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Links Sections - Responsive grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:col-span-3 md:grid-cols-3 md:gap-8 lg:gap-10">
            {/* About Us */}
            <div>
              <h4 className="text-base xs:text-lg sm:text-xl font-semibold mb-3 xs:mb-4 dark:text-white">
                About Us
              </h4>
              <ul className="space-y-2 xs:space-y-2.5 sm:space-y-3">
                {footerLinks.about.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300 dark:text-gray-400 dark:hover:text-cyan-400 text-sm xs:text-base py-1 xs:py-1.5 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Policy */}
            <div>
              <h4 className="text-base xs:text-lg sm:text-xl font-semibold mb-3 xs:mb-4 dark:text-white">
                Legal & Policy
              </h4>
              <ul className="space-y-2 xs:space-y-2.5 sm:space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300 dark:text-gray-400 dark:hover:text-cyan-400 text-sm xs:text-base py-1 xs:py-1.5 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="xs:col-span-2 md:col-span-1">
              <h4 className="text-base xs:text-lg sm:text-xl font-semibold mb-3 xs:mb-4 dark:text-white">
                Contact Us
              </h4>
              <ul className="space-y-2 xs:space-y-2.5 sm:space-y-3">
                {footerLinks.contact.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 xs:gap-3 text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300 dark:text-gray-400 dark:hover:text-cyan-400 text-sm xs:text-base py-1 xs:py-1.5 group"
                    >
                      <span className="material-symbols-outlined text-lg xs:text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {link.icon}
                      </span>
                      <span className="break-words">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 xs:mt-10 sm:mt-12 border-t border-gray-200 pt-6 xs:pt-8 flex flex-col xs:flex-row items-center justify-between gap-4 xs:gap-6 dark:border-gray-800">
          <p className="text-[#9CA3AF] text-xs xs:text-sm dark:text-gray-400 text-center xs:text-left order-2 xs:order-1">
            © {new Date().getFullYear()} Concept Builders. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3 xs:gap-4 order-1 xs:order-2">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300 dark:text-gray-400 dark:hover:text-cyan-400 p-1.5 xs:p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50"
                aria-label={link.name}
              >
                <link.icon className="h-4 w-4 xs:h-5 xs:w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
