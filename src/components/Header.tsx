"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/designs", label: "House plans" },
  { href: "/design-showcase", label: "Inspiration" },
  { href: "/ongoing-projects", label: "Our projects" },
  { href: "/custom-design", label: "Custom design" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#17251d]/95 text-[#f9f4e8] backdrop-blur-md">
      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-9 lg:px-14">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Concept Builders home">
          <Image src="/images/concept-builders-logo-free-bg.webp" alt="" width={47} height={47} priority className="h-11 w-11 shrink-0 object-contain" />
          <span className="truncate font-display text-[22px] font-medium tracking-[.01em] sm:text-[26px]">Concept Builders</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="text-[13px] font-medium text-[#e4e6dc] transition-colors hover:text-[#e2b573] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e2b573] aria-[current=page]:text-[#e2b573]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="hidden min-h-10 items-center justify-center border border-[#c99c58] px-5 text-[12px] font-semibold text-[#f7e9cf] transition-colors hover:bg-[#c99c58] hover:text-[#17251d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e2b573] lg:inline-flex">
          Talk to us <span aria-hidden="true" className="ml-3">↗</span>
        </Link>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/25 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2b573] lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-controls="mobile-primary-navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <span aria-hidden="true" className="text-2xl leading-none">×</span> : (
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          )}
        </button>
      </div>
      <nav id="mobile-primary-navigation" aria-label="Mobile navigation" hidden={!open} className="border-t border-white/10 bg-[#17251d] px-5 pb-5 pt-2 lg:hidden">
        {links.map((link) => (
          <Link href={link.href} key={link.href} onClick={() => setOpen(false)} className="block border-b border-white/10 py-3.5 text-[16px] focus-visible:outline focus-visible:outline-[#e2b573]">
            {link.label}
          </Link>
        ))}
        <Link href="/contact" onClick={() => setOpen(false)} className="mt-4 flex min-h-12 items-center justify-center bg-[#c99c58] px-5 text-sm font-semibold text-[#17251d] focus-visible:outline focus-visible:outline-[#e2b573]">
          Talk to us <span aria-hidden="true" className="ml-2">↗</span>
        </Link>
      </nav>
    </header>
  );
}
