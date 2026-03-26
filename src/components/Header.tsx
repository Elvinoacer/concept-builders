"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PublicThemeToggle from "@/components/ui/public-theme-toggle";

const Header = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const primaryLinks = [
    { href: "/designs", label: "Plans" },
    { href: "/categories", label: "Categories" },
    { href: "/design-showcase", label: "Showcase" },
    { href: "/ongoing-projects", label: "Projects" },
  ];

  const mobileLinks = [
    ...primaryLinks,
    { href: "/custom-design", label: "Custom Design" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          isScrolled
            ? "border-cb-border bg-[rgba(10,9,7,0.92)] backdrop-blur-[20px]"
            : "border-cb-border bg-card"
        }`}
      >
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-5 py-4 sm:px-6 lg:px-[60px]">
          <Link
            href="/"
            className="flex items-center gap-3"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            <span className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
              <Image
                src="/images/concept-builders-logo-free-bg.webp"
                alt="Concept Builders logo"
                fill
                priority
                sizes="(max-width: 640px) 40px, (max-width: 1024px) 48px, 56px"
                className="object-contain"
              />
            </span>
            <span className="text-[20px] font-medium tracking-[0.06em] text-cream sm:text-[22px]">
              Concept Builders
            </span>
          </Link>

          <nav
            className="hidden items-center gap-10 lg:flex"
            aria-label="Primary"
          >
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.12em] text-cream-dim transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/custom-design"
              className="border border-gold px-6 py-2.5 text-[12px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Start a Project
            </Link>
          </nav>

          <div className="hidden lg:block">
            <PublicThemeToggle className="h-9 w-9" />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <PublicThemeToggle className="h-9 w-9" />
            <button
              className="relative z-[110] flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`block h-[1.5px] w-6 bg-cream transition-all duration-300 ${
                  mobileMenuOpen ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-6 bg-cream transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-6 bg-cream transition-all duration-300 ${
                  mobileMenuOpen ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[49] bg-ink/95 backdrop-blur-md transition-all duration-500 lg:pointer-events-none lg:hidden ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
          {mobileLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-center text-[28px] font-light tracking-[0.08em] text-cream transition-all duration-500 hover:text-gold ${
                mobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: mobileMenuOpen ? `${150 + i * 60}ms` : "0ms",
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/custom-design"
            onClick={() => setMobileMenuOpen(false)}
            className={`mt-4 border border-gold px-8 py-3 text-[13px] uppercase tracking-[0.16em] text-gold transition-all duration-500 hover:bg-gold hover:text-ink ${
              mobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: mobileMenuOpen ? "510ms" : "0ms" }}
          >
            Start a Project
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
