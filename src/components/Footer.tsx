import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "@/lib/dummydata";

const explore = [
  { href: "/designs", label: "House plans" },
  { href: "/categories", label: "Categories" },
  { href: "/design-showcase", label: "Design inspiration" },
  { href: "/ongoing-projects", label: "Our projects" },
];

const company = [
  { href: "/custom-design", label: "Custom design" },
  { href: "/about", label: "About us" },
  { href: "/faq", label: "Frequently asked questions" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#131d17] px-5 py-14 text-[#efece1] sm:px-9 lg:px-14">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-[360px]">
            <Link href="/" className="inline-flex items-center gap-2.5 focus-visible:outline focus-visible:outline-[#c99c58]">
              <Image src="/images/concept-builders-logo-free-bg.webp" alt="" width={43} height={43} className="object-contain" />
              <span className="font-display text-2xl">Concept Builders</span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-[#c3cabe]">
              House plans and architectural design for the places you want to call home.
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[.15em] text-[#d8ad70]">Explore</h2>
            <ul className="space-y-3 text-sm text-[#c3cabe]">
              {explore.map((item) => <li key={item.href}><Link className="hover:text-white" href={item.href}>{item.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[.15em] text-[#d8ad70]">Concept Builders</h2>
            <ul className="space-y-3 text-sm text-[#c3cabe]">
              {company.map((item) => <li key={item.href}><Link className="hover:text-white" href={item.href}>{item.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[.15em] text-[#d8ad70]">Get in touch</h2>
            <div className="flex flex-col items-start gap-3 text-sm text-[#c3cabe]">
              <a className="hover:text-white" href="https://wa.me/254741360865" target="_blank" rel="noopener noreferrer">WhatsApp us ↗</a>
              <a className="hover:text-white" href="tel:+254741360865">+254 741 360 865</a>
              <a className="break-all hover:text-white" href="mailto:support@conceptbuilders.co.ke">support@conceptbuilders.co.ke</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-5 pt-7 text-xs text-[#aab2a7] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Concept Builders. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/refund" className="hover:text-white">Refunds</Link>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((link, index) => (
              <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer" aria-label={"Concept Builders social profile " + (index + 1)} className="text-[#c3cabe] hover:text-[#e0b36f]">
                <link.icon aria-hidden="true" className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
