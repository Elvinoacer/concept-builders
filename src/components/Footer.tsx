"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { footerLinks, socialLinks } from "@/lib/dummydata";

const Footer = () => {
  const exploreLinks = [
    { href: "/designs", label: "House Plans" },
    { href: "/categories", label: "Categories" },
    { href: "/design-showcase", label: "Design Showcase" },
    { href: "/ongoing-projects", label: "Projects" },
  ];

  const servicesLinks = [
    { href: "/custom-design", label: "Custom Design" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
  ];

  const legacyLinks = useMemo(() => {
    const merged = [
      ...footerLinks.about,
      ...footerLinks.legal,
      ...footerLinks.contact,
      { href: "/", label: "Home" },
      { href: "/custom-design", label: "Start a Project" },
    ];

    const seen = new Set<string>();
    return merged.filter((link) => {
      const key = `${link.href}:${link.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);

  return (
    <footer className="border-t border-cb-border bg-card px-6 pb-10 pt-16 lg:px-[60px]">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="mb-14 grid grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-12 max-[1000px]:grid-cols-2 max-[1000px]:gap-8 max-[560px]:grid-cols-1">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Image
                src="/images/concept-builders-logo-free-bg.png"
                alt="Concept Builders logo"
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
                priority
              />
              <span
                className="text-[28px] font-light text-cream"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                Concept Builders
              </span>
            </div>
            <p className="mb-7 max-w-[460px] text-[13px] leading-[1.8] text-cb-muted">
              Your trusted partner in architectural design across Kenya. We turn
              blueprints into homes and homes into legacies.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-cream transition-colors hover:text-gold"
            >
              Contact Us
              <svg
                className="transition-transform duration-300 group-hover:translate-x-1.5"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-gold">
              Explore
            </p>
            <ul className="space-y-2.5 text-[13px] text-cb-muted">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-gold">
              Services
            </p>
            <ul className="space-y-2.5 text-[13px] text-cb-muted">
              {servicesLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className="hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-gold">
              More Links
            </p>
            <ul className="space-y-2.5 text-[13px] text-cb-muted">
              {legacyLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className="hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-cb-border pt-8 max-[900px]:flex-col max-[900px]:gap-5">
          <p className="text-[12px] tracking-[0.06em] text-cb-muted">
            © {new Date().getFullYear()} Concept Builders Kenya. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="rounded-md p-2 text-cb-muted transition-all duration-300 hover:bg-surface hover:text-gold"
                aria-label={`Social link ${index + 1}`}
                target="_blank"
                rel="noreferrer"
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
