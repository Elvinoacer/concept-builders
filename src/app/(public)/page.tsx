import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import LandingNav from "@/components/landing/LandingNav";
import FeaturedDesignsSection from "@/components/landing/FeaturedDesignsSection";
import TestimonialSection from "@/components/landing/TestimonialSection";

export const revalidate = 300;

export default async function Home() {
  const heroBanners = [
    "/images/banners/banner1.webp",
    "/images/banners/banner2.webp",
    "/images/banners/banner3.webp",
    "/images/banners/banner4.webp",
    "/images/banners/banner5.webp",
    "/images/banners/banner6.webp",
  ];

  const activeBannerIndex = 0;
  const countPlans = 500;
  const countHomeowners = 1200;
  const countCounties = 47;
  const countYears = 12;
  const revealClass = "reveal visible";
  const revealDelay0 = { transitionDelay: "0ms" };
  const revealDelay150 = { transitionDelay: "150ms" };
  const revealDelay300 = { transitionDelay: "300ms" };

  const marqueeItems = [
    "Architectural Excellence",
    "Innovative Design Solutions",
    "Sustainable Construction",
    "Client-Centred Approach",
    "Kenyan Dream Homes",
    "Bespoke Blueprints",
  ];

  return (
    <div className="relative w-full overflow-x-hidden bg-ink text-cream">
      <LandingNav />

      <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-5 pb-12 pt-28 sm:px-6 sm:pb-20 sm:pt-40 lg:px-[60px]">
        <div className="absolute inset-0 bg-[var(--surface)]" />
        <div className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out opacity-100">
          <picture className="absolute inset-0">
            <source
              media="(max-width: 828px)"
              srcSet={heroBanners[activeBannerIndex].replace(
                ".webp",
                "-mobile.webp",
              )}
            />
            <img
              src={heroBanners[activeBannerIndex]}
              alt=""
              aria-hidden="true"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover object-center opacity-40 scale-100 transition-transform duration-[5200ms] ease-out"
              style={{ opacity: "var(--landing-hero-image-opacity)" }}
            />
          </picture>
        </div>
        <div
          className="absolute inset-0"
          style={{ background: "var(--landing-hero-overlay)" }}
        />
        <div
          className="absolute inset-0 bg-[size:80px_80px]"
          style={{
            backgroundImage:
              "linear-gradient(var(--landing-hero-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--landing-hero-grid-line) 1px, transparent 1px)",
            maskImage: "var(--landing-hero-grid-mask)",
          }}
        />

        <div className="relative z-10">
          <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] text-gold animate-[fadeUp_0.8s_ease_0.3s_forwards] opacity-0">
            <span className="h-px w-10 bg-gold" />
            Est. Kenya · Architecture & Design
          </p>

          <h1
            className="mb-6 text-[clamp(44px,9vw,130px)] font-light leading-[0.92] tracking-[-0.02em] sm:mb-10"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            <span className="block overflow-hidden">
              <span className="block translate-y-full opacity-0 [animation:slideUp_0.9s_cubic-bezier(0.16,1,0.3,1)_0.5s_forwards]">
                Your Dream.
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="block translate-y-full opacity-0 [animation:slideUp_0.9s_cubic-bezier(0.16,1,0.3,1)_0.65s_forwards]">
                Our <em className="text-gold not-italic">Blueprint.</em>
              </span>
            </span>
          </h1>

          <div className="flex items-end justify-between gap-6 max-[900px]:flex-col max-[900px]:items-start animate-[fadeUp_0.8s_ease_1.1s_forwards] opacity-0 sm:gap-10">
            <p className="max-w-[380px] text-[13px] leading-[1.7] text-cream-dim sm:text-[15px]">
              We turn visions into liveable reality - exceptional architectural
              designs and bespoke house plans, crafted for the way you want to
              live.
            </p>
            <div className="flex w-full items-center gap-4 max-[900px]:flex-col max-[900px]:items-stretch sm:w-auto sm:gap-5 max-[900px]:sm:items-start">
              <Link
                href="/designs"
                className="group relative overflow-hidden bg-gold px-9 py-4 text-center text-[13px] font-medium uppercase tracking-[0.14em] text-ink"
              >
                <span className="absolute inset-0 -translate-x-full bg-gold-light transition-transform duration-300 group-hover:translate-x-0" />
                <span className="relative z-10">Browse House Plans</span>
              </Link>
              <Link
                href="/custom-design"
                className="group flex items-center justify-center gap-2.5 text-[13px] uppercase tracking-[0.12em] text-cream transition-colors hover:text-gold sm:justify-start"
              >
                Custom Design
                <svg
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                  width="16"
                  height="16"
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
          </div>
        </div>
      </section>

      <div className="flex items-stretch overflow-hidden border-y border-cb-border bg-card px-6 lg:px-[60px] max-[900px]:flex-wrap">
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 border-r border-cb-border py-9 text-center max-[900px]:basis-1/2 max-[900px]:border-b">
          <p
            className="text-[32px] font-light leading-none sm:text-[42px]"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            {countPlans}+
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cb-muted">
            House Plans
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 border-r border-cb-border py-9 text-center max-[900px]:basis-1/2 max-[900px]:border-b max-[900px]:border-r-0">
          <p
            className="text-[32px] font-light leading-none sm:text-[42px]"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            {countHomeowners}+
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cb-muted">
            Happy Homeowners
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 border-r border-cb-border py-9 text-center max-[900px]:basis-1/2">
          <p
            className="text-[32px] font-light leading-none sm:text-[42px]"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            {countCounties}
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cb-muted">
            Counties Served
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 py-9 text-center max-[900px]:basis-1/2">
          <p
            className="text-[32px] font-light leading-none sm:text-[42px]"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            {countYears} <span className="text-gold">Yrs</span>
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cb-muted">
            Of Excellence
          </p>
        </div>
      </div>

      <section className="overflow-hidden border-b border-cb-border bg-card py-8">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex flex-shrink-0 items-center gap-7 px-10"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span
                className="text-[20px] italic text-cream-dim"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-cb-border px-6 py-24 lg:px-[60px] max-[900px]:px-6 max-[900px]:py-16">
        <div className={revealClass} style={revealDelay0}>
          <div className="mb-16 flex items-start justify-between gap-10 max-[900px]:flex-col">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-gold">
                <span className="h-px w-7 bg-gold" />
                The Process
              </p>
              <h2
                className="text-[clamp(36px,4.5vw,60px)] font-light leading-[1.1]"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                From Vision
                <br />
                to <em className="text-gold">Reality</em>
              </h2>
            </div>
            <p className="max-w-[360px] pt-12 text-[14px] leading-[1.8] text-cream-dim max-[900px]:pt-0">
              Three seamless steps stand between you and the home you have
              always imagined. We have made the journey as beautiful as the
              destination.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 max-[900px]:grid-cols-1">
          <div
            className={`${revealClass} border-r border-cb-border pr-12 max-[900px]:border-b max-[900px]:border-r-0 max-[900px]:py-10 max-[900px]:pr-0`}
            style={revealDelay0}
          >
            <p
              className="mb-6 text-[80px] font-light leading-none text-[rgba(200,137,42,0.12)]"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              01
            </p>
            <div className="mb-5 flex h-12 w-12 items-center justify-center border border-gold/30 text-gold">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <h3
              className="mb-3.5 text-[26px]"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              Explore & Discover
            </h3>
            <p className="text-[14px] leading-[1.8] text-cream-dim">
              Browse curated plans - from compact maisonettes to spacious family
              homes. Filter by budget, style and size.
            </p>
          </div>

          <div
            className={`${revealClass} border-r border-cb-border px-12 max-[900px]:border-b max-[900px]:border-r-0 max-[900px]:px-0 max-[900px]:py-10`}
            style={revealDelay150}
          >
            <p
              className="mb-6 text-[80px] font-light leading-none text-[rgba(200,137,42,0.12)]"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              02
            </p>
            <div className="mb-5 flex h-12 w-12 items-center justify-center border border-gold/30 text-gold">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <h3
              className="mb-3.5 text-[26px]"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              Purchase & Customise
            </h3>
            <p className="text-[14px] leading-[1.8] text-cream-dim">
              Secure your chosen plan and collaborate with our architects to
              tailor layouts, facades and finishes to your vision.
            </p>
          </div>

          <div
            className={`${revealClass} pl-12 max-[900px]:pl-0 max-[900px]:py-10`}
            style={revealDelay300}
          >
            <p
              className="mb-6 text-[80px] font-light leading-none text-[rgba(200,137,42,0.12)]"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              03
            </p>
            <div className="mb-5 flex h-12 w-12 items-center justify-center border border-gold/30 text-gold">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3
              className="mb-3.5 text-[26px]"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              Download & Build
            </h3>
            <p className="text-[14px] leading-[1.8] text-cream-dim">
              Receive your complete architectural drawings and begin building
              with a trusted contractor in your location.
            </p>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="h-[520px] border-b border-cb-border px-6 py-24 lg:px-[60px]" />
        }
      >
        <FeaturedDesignsSection />
      </Suspense>

      <Suspense
        fallback={
          <section className="grid h-[560px] grid-cols-2 border-b border-cb-border px-5 py-16 sm:px-6 sm:py-28 lg:px-[60px] max-[900px]:grid-cols-1" />
        }
      >
        <TestimonialSection />
      </Suspense>

      <section className="relative overflow-hidden px-5 py-16 text-center sm:px-6 sm:py-20 lg:px-[60px] lg:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(200,137,42,0.08)_0%,transparent_70%)]" />
        <div className={revealClass} style={revealDelay0}>
          <p className="mb-5 text-[11px] uppercase tracking-[0.25em] text-gold">
            Begin Your Journey
          </p>
          <h2
            className="mb-6 text-[clamp(36px,7vw,96px)] font-light leading-none tracking-[-0.02em]"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            Build the Home
            <br />
            You <em className="text-gold">Deserve</em>
          </h2>
          <p className="mx-auto mb-12 max-w-[480px] text-[15px] leading-[1.7] text-cream-dim">
            Join over 1,200 Kenyan homeowners who chose Concept Builders to
            bring their vision to life with precision and craft.
          </p>
          <div className="flex items-center justify-center gap-5 max-[900px]:flex-col max-[900px]:items-stretch sm:gap-6">
            <Link
              href="/designs"
              className="group relative overflow-hidden bg-gold px-9 py-4 text-center text-[13px] font-medium uppercase tracking-[0.14em] text-ink"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold-light transition-transform duration-300 group-hover:translate-x-0" />
              <span className="relative z-10">Browse All Plans</span>
            </Link>
            <Link
              href="/custom-design"
              className="group flex items-center justify-center gap-2.5 text-[13px] uppercase tracking-[0.12em] text-cream transition-colors hover:text-gold"
            >
              Request Custom Design
              <svg
                className="transition-transform duration-300 group-hover:translate-x-1.5"
                width="16"
                height="16"
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
        </div>
      </section>

      <footer className="border-t border-cb-border bg-card px-6 pb-10 pt-16 lg:px-[60px]">
        <div className="mb-14 grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-14 max-[900px]:grid-cols-2 max-[900px]:gap-8 max-[480px]:grid-cols-1">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="relative h-10 w-10">
                <Image
                  src="/images/concept-builders-logo-free-bg.webp"
                  alt="Concept Builders logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </span>
              <span
                className="text-[28px] font-light"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                Concept Builders
              </span>
            </div>
            <p className="mb-7 text-[13px] leading-[1.8] text-cb-muted">
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
              <li>
                <Link href="/designs" className="hover:text-cream">
                  House Plans
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-cream">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/design-showcase" className="hover:text-cream">
                  Design Showcase
                </Link>
              </li>
              <li>
                <Link href="/ongoing-projects" className="hover:text-cream">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-gold">
              Services
            </p>
            <ul className="space-y-2.5 text-[13px] text-cb-muted">
              <li>
                <Link href="/custom-design" className="hover:text-cream">
                  Custom Design
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cream">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-cream">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cream">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-gold">
              Legal
            </p>
            <ul className="space-y-2.5 text-[13px] text-cb-muted">
              <li>
                <Link href="/terms" className="hover:text-cream">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cream">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-cream">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-cb-border pt-8 max-[900px]:flex-col max-[900px]:gap-5">
          <p className="text-[12px] tracking-[0.06em] text-cb-muted">
            © {new Date().getFullYear()} Concept Builders Kenya. All rights
            reserved.
          </p>
          <div className="flex gap-5">
            <a
              href="https://www.instagram.com/conceptbuilderske?igsh=YzljYTk1ODg3Zg=="
              target="_blank"
              rel="noreferrer"
              className="text-[12px] uppercase tracking-[0.12em] text-cb-muted hover:text-gold"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/conceptbuilders"
              target="_blank"
              rel="noreferrer"
              className="text-[12px] uppercase tracking-[0.12em] text-cb-muted hover:text-gold"
            >
              Facebook
            </a>
            <a
              href="https://wa.me/254741360865"
              target="_blank"
              rel="noreferrer"
              className="text-[12px] uppercase tracking-[0.12em] text-cb-muted hover:text-gold"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
