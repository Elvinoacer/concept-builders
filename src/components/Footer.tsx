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
        setEmail("");
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
    <footer className="w-full border-t border-cb-border bg-surface text-cream">
      <div className="mx-auto w-full max-w-7xl px-4 min-[375px]:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 min-[375px]:py-10 sm:py-12 md:py-16 lg:py-20">
        {/* Main Footer Content - Improved responsive grid */}
        <div className="grid grid-cols-1 gap-8 min-[375px]:gap-10 sm:gap-12 md:grid-cols-4 lg:gap-16 xl:gap-20">
          {/* Brand Section */}
          <div className="flex flex-col gap-4 min-[375px]:gap-5 sm:gap-6 md:col-span-1 lg:gap-8">
            <div className="flex items-center gap-3 min-[375px]:gap-4">
              <Image
                src="/images/concept-builders-logo-free-bg.png"
                alt="Concept Builders Logo"
                width={80}
                height={80}
                className="w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0"
                priority
              />
              <span className="text-xl min-[375px]:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gold to-gold-light text-transparent bg-clip-text leading-tight">
                Concept Builders
              </span>
            </div>
            <p className="text-cb-muted text-sm min-[375px]:text-base sm:text-lg md:text-base lg:text-lg leading-relaxed sm:leading-loose">
              Your partner in building the future. Discover, purchase, and
              actualize your dream home with us.
            </p>

            {/* Newsletter Subscription */}
            <div className="mt-4 min-[375px]:mt-5 sm:mt-6 lg:mt-8">
              <h4 className="text-lg min-[375px]:text-xl sm:text-2xl md:text-xl lg:text-2xl font-semibold mb-3 min-[375px]:mb-4 sm:mb-5 text-cream leading-tight">
                Stay Updated
              </h4>
              <form
                className="flex flex-col gap-3 min-[375px]:gap-4"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 min-[375px]:px-5 py-3 min-[375px]:py-3.5 sm:py-4 rounded-xl border border-cb-border focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-card text-cream text-base min-[375px]:text-lg placeholder:text-cb-muted transition-all duration-300 hover:border-gold/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 min-[375px]:py-3.5 sm:py-4 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition-all duration-300 text-base min-[375px]:text-lg sm:text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 focus:ring-2 focus:ring-gold/40 focus:outline-none"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                      Subscribing...
                    </span>
                  ) : (
                    "Subscribe Now"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Links Sections - Enhanced responsive grid */}
          <div className="grid grid-cols-1 min-[375px]:grid-cols-2 gap-8 min-[375px]:gap-10 sm:gap-12 md:col-span-3 md:grid-cols-3 md:gap-8 lg:gap-12 xl:gap-16">
            {/* About Us */}
            <div>
              <h4 className="text-lg min-[375px]:text-xl sm:text-2xl md:text-xl lg:text-2xl font-semibold mb-4 min-[375px]:mb-5 sm:mb-6 text-cream leading-tight">
                About Us
              </h4>
              <ul className="space-y-3 min-[375px]:space-y-3.5 sm:space-y-4">
                {footerLinks.about.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-cb-muted hover:text-gold transition-all duration-300 text-base min-[375px]:text-lg sm:text-xl md:text-base lg:text-lg py-2 min-[375px]:py-2.5 block hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-lg px-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Policy */}
            <div>
              <h4 className="text-lg min-[375px]:text-xl sm:text-2xl md:text-xl lg:text-2xl font-semibold mb-4 min-[375px]:mb-5 sm:mb-6 text-cream leading-tight">
                Legal & Policy
              </h4>
              <ul className="space-y-3 min-[375px]:space-y-3.5 sm:space-y-4">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-cb-muted hover:text-gold transition-all duration-300 text-base min-[375px]:text-lg sm:text-xl md:text-base lg:text-lg py-2 min-[375px]:py-2.5 block hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-lg px-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="min-[375px]:col-span-2 md:col-span-1">
              <h4 className="text-lg min-[375px]:text-xl sm:text-2xl md:text-xl lg:text-2xl font-semibold mb-4 min-[375px]:mb-5 sm:mb-6 text-cream leading-tight">
                Contact Us
              </h4>
              <ul className="space-y-3 min-[375px]:space-y-3.5 sm:space-y-4">
                {footerLinks.contact.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="flex items-start gap-3 min-[375px]:gap-4 text-cb-muted hover:text-gold transition-all duration-300 text-base min-[375px]:text-lg sm:text-xl md:text-base lg:text-lg py-2 min-[375px]:py-2.5 group focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-lg px-2"
                    >
                      <span className="material-symbols-outlined text-xl min-[375px]:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 mt-0.5">
                        {link.icon}
                      </span>
                      <span className="break-words leading-relaxed flex-1">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Improved stacking */}
        <div className="mt-10 min-[375px]:mt-12 sm:mt-16 border-t border-cb-border pt-6 min-[375px]:pt-8 sm:pt-10 flex flex-col min-[375px]:flex-row items-center justify-between gap-4 min-[375px]:gap-6 sm:gap-8">
          <p className="text-cb-muted text-sm min-[375px]:text-base sm:text-lg text-center min-[375px]:text-left order-2 min-[375px]:order-1">
            © {new Date().getFullYear()} Concept Builders. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4 min-[375px]:gap-5 sm:gap-6 order-1 min-[375px]:order-2">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-cb-muted hover:text-gold transition-all duration-300 p-2 min-[375px]:p-2.5 sm:p-3 rounded-xl hover:bg-card/70 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gold/40"
                aria-label={`Social link ${index + 1}`}
              >
                <link.icon className="h-5 w-5 min-[375px]:h-6 min-[375px]:w-6 sm:h-7 sm:w-7" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
