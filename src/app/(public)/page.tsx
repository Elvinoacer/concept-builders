"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type DesignItem = {
  id: string;
  name: string;
  category?: {
    name: string;
  } | null;
  images?: Array<{ url: string }>;
  orderItems?: Array<{ id: string }>;
};

type FeaturedFeedback = {
  name: string;
  message: string;
};

function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return {
    ref,
    className: `reveal ${visible ? "visible" : ""}`,
    style: { transitionDelay: `${delay}ms` },
  };
}

function useCountUp(target: number, isActive: boolean, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    let start = 0;
    let frame = 0;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    frame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frame);
  }, [duration, isActive, target]);

  return count;
}

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [feedback, setFeedback] = useState<FeaturedFeedback | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.add("landing-redesign-active");
    return () => document.body.classList.remove("landing-redesign-active");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [designsRes, feedbackRes] = await Promise.all([
          fetch("/api/designs?limit=12&page=1"),
          fetch("/api/featured-feedback"),
        ]);

        if (designsRes.ok) {
          const data = await designsRes.json();
          setDesigns(data.designs || []);
        }

        if (feedbackRes.ok) {
          const data = await feedbackRes.json();
          if (Array.isArray(data) && data.length > 0) {
            setFeedback({ name: data[0].name, message: data[0].message });
          }
        }
      } catch (error) {
        console.error("Failed to load landing data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const bestSellingPlans = useMemo(() => {
    return [...designs]
      .sort((a, b) => (b.orderItems?.length || 0) - (a.orderItems?.length || 0))
      .slice(0, 3);
  }, [designs]);

  const countPlans = useCountUp(500, statsVisible);
  const countHomeowners = useCountUp(1200, statsVisible);
  const countCounties = useCountUp(47, statsVisible);
  const countYears = useCountUp(12, statsVisible);

  const headerReveal = useReveal<HTMLDivElement>(0);
  const stepRevealOne = useReveal<HTMLDivElement>(0);
  const stepRevealTwo = useReveal<HTMLDivElement>(150);
  const stepRevealThree = useReveal<HTMLDivElement>(300);
  const plansReveal = useReveal<HTMLDivElement>(0);
  const plansFooterReveal = useReveal<HTMLDivElement>(100);
  const testimonialLeftReveal = useReveal<HTMLDivElement>(0);
  const testimonialRightReveal = useReveal<HTMLDivElement>(200);
  const ctaReveal = useReveal<HTMLDivElement>(0);

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
      <nav
        className={`fixed inset-x-0 top-0 z-[100] mx-auto flex w-full items-center justify-between border-b px-6 py-6 transition-all duration-300 lg:px-[60px] ${
          navScrolled
            ? "border-cb-border bg-[rgba(10,9,7,0.92)] py-4 backdrop-blur-[20px]"
            : "border-transparent bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-3 text-[22px] font-medium tracking-[0.06em]"
          style={{
            fontFamily:
              'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
          }}
        >
          <span className="flex h-7 w-7 items-center justify-center border border-gold rotate-45">
            <span className="h-2 w-2 bg-gold -rotate-45" />
          </span>
          Concept Builders
        </Link>

        <ul className="hidden items-center gap-10 lg:flex">
          <li>
            <Link
              href="/designs"
              className="text-xs uppercase tracking-[0.12em] text-cream-dim hover:text-gold transition-colors"
            >
              Plans
            </Link>
          </li>
          <li>
            <Link
              href="/categories"
              className="text-xs uppercase tracking-[0.12em] text-cream-dim hover:text-gold transition-colors"
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              href="/design-showcase"
              className="text-xs uppercase tracking-[0.12em] text-cream-dim hover:text-gold transition-colors"
            >
              Showcase
            </Link>
          </li>
          <li>
            <Link
              href="/ongoing-projects"
              className="text-xs uppercase tracking-[0.12em] text-cream-dim hover:text-gold transition-colors"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/custom-design"
              className="border border-gold px-6 py-2.5 text-[12px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Start a Project
            </Link>
          </li>
        </ul>
      </nav>

      <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-20 pt-40 lg:px-[60px]">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,9,7,0.3)_0%,rgba(10,9,7,0.15)_40%,rgba(10,9,7,0.85)_80%,var(--ink)_100%),linear-gradient(135deg,rgba(200,137,42,0.04)_0%,transparent_60%)]" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 transition-transform duration-[8000ms] ease-out"
          style={{
            backgroundImage:
              "url(https://concept-builders.sfo3.digitaloceanspaces.com/designs/1763456171240-A_13%20-%20Photo%20(8).jpg)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.04)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.4)_30%,rgba(0,0,0,0.4)_70%,transparent_100%)]" />

        <div className="relative z-10">
          <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] text-gold animate-[fadeUp_0.8s_ease_0.3s_forwards] opacity-0">
            <span className="h-px w-10 bg-gold" />
            Est. Kenya · Architecture & Design
          </p>

          <h1
            className="mb-10 text-[clamp(64px,9vw,130px)] font-light leading-[0.92] tracking-[-0.02em]"
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

          <div className="flex items-end justify-between gap-10 max-[900px]:flex-col max-[900px]:items-start animate-[fadeUp_0.8s_ease_1.1s_forwards] opacity-0">
            <p className="max-w-[380px] text-[15px] leading-[1.7] text-cream-dim">
              We turn visions into liveable reality - exceptional architectural
              designs and bespoke house plans, crafted for the way you want to
              live.
            </p>
            <div className="flex items-center gap-5 max-[900px]:flex-col max-[900px]:items-start">
              <Link
                href="/designs"
                className="group relative overflow-hidden bg-gold px-9 py-4 text-[13px] font-medium uppercase tracking-[0.14em] text-ink"
              >
                <span className="absolute inset-0 -translate-x-full bg-gold-light transition-transform duration-300 group-hover:translate-x-0" />
                <span className="relative z-10">Browse House Plans</span>
              </Link>
              <Link
                href="/custom-design"
                className="group flex items-center gap-2.5 text-[13px] uppercase tracking-[0.12em] text-cream transition-colors hover:text-gold"
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

      <div
        ref={statsRef}
        className="flex items-stretch overflow-hidden border-y border-cb-border bg-card px-6 lg:px-[60px] max-[900px]:flex-wrap"
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 border-r border-cb-border py-9 text-center max-[900px]:basis-1/2 max-[900px]:border-b">
          <p
            className="text-[42px] font-light leading-none"
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
            className="text-[42px] font-light leading-none"
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
            className="text-[42px] font-light leading-none"
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
            className="text-[42px] font-light leading-none"
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
        <div
          ref={headerReveal.ref}
          className={headerReveal.className}
          style={headerReveal.style}
        >
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
            ref={stepRevealOne.ref}
            className={`${stepRevealOne.className} border-r border-cb-border pr-12 max-[900px]:border-b max-[900px]:border-r-0 max-[900px]:py-10 max-[900px]:pr-0`}
            style={stepRevealOne.style}
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
            ref={stepRevealTwo.ref}
            className={`${stepRevealTwo.className} border-r border-cb-border px-12 max-[900px]:border-b max-[900px]:border-r-0 max-[900px]:px-0 max-[900px]:py-10`}
            style={stepRevealTwo.style}
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
            ref={stepRevealThree.ref}
            className={`${stepRevealThree.className} pl-12 max-[900px]:pl-0 max-[900px]:py-10`}
            style={stepRevealThree.style}
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

      <section className="border-b border-cb-border px-6 py-24 lg:px-[60px] max-[900px]:px-6 max-[900px]:py-16">
        <div
          ref={plansReveal.ref}
          className={plansReveal.className}
          style={plansReveal.style}
        >
          <div className="mb-16 flex items-start justify-between gap-10 max-[900px]:flex-col">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-gold">
                <span className="h-px w-7 bg-gold" />
                Featured Designs
              </p>
              <h2
                className="text-[clamp(36px,4.5vw,60px)] font-light leading-[1.1]"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                Most Sought
                <br />
                After <em className="text-gold">Plans</em>
              </h2>
            </div>
            <p className="max-w-[360px] pt-12 text-[14px] leading-[1.8] text-cream-dim max-[900px]:pt-0">
              Our best-selling architectural designs chosen by discerning
              homeowners across Kenya.
            </p>
          </div>

          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-px bg-cb-border max-[900px]:grid-cols-1">
            {bestSellingPlans.map((design) => (
              <article
                key={design.id}
                className="group bg-ink transition-colors hover:bg-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={
                      design.images?.[0]?.url ||
                      "/images/category-placeholder.png"
                    }
                    alt={design.name}
                    fill
                    className="object-cover brightness-[0.85] saturate-90 transition duration-500 group-hover:scale-105 group-hover:brightness-95 group-hover:saturate-100"
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </div>
                <div className="p-8">
                  <span className="mb-4 inline-flex items-center border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold">
                    Best Seller
                  </span>
                  <h3
                    className="mb-2.5 text-[22px] leading-[1.3]"
                    style={{
                      fontFamily:
                        'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                    }}
                  >
                    {design.name}
                  </h3>
                  <div className="mt-5 flex items-center justify-between border-t border-cb-border pt-5">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-cb-muted">
                      {design.category?.name || "House Plans"}
                    </span>
                    <Link
                      href={`/designs/${design.id}`}
                      className="group/link flex items-center gap-2 text-[12px] tracking-[0.1em] text-gold"
                    >
                      View Plan
                      <svg
                        className="transition-transform duration-300 group-hover/link:translate-x-1.5"
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
                </div>
              </article>
            ))}
          </div>

          <div
            ref={plansFooterReveal.ref}
            className={`${plansFooterReveal.className} mt-12 flex items-center justify-between gap-6 max-[900px]:flex-col max-[900px]:items-start`}
            style={plansFooterReveal.style}
          >
            <p
              className="text-[16px] text-cb-muted"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              Showing {bestSellingPlans.length} of{" "}
              <span className="text-gold">500+</span> available designs
            </p>
            <Link
              href="/designs"
              className="group relative overflow-hidden bg-gold px-9 py-4 text-[13px] font-medium uppercase tracking-[0.14em] text-ink"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold-light transition-transform duration-300 group-hover:translate-x-0" />
              <span className="relative z-10">Explore All Designs</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 items-center gap-24 border-b border-cb-border px-6 py-28 lg:px-[60px] max-[900px]:grid-cols-1 max-[900px]:gap-12 max-[900px]:px-6 max-[900px]:py-16">
        <div
          ref={testimonialLeftReveal.ref}
          className={testimonialLeftReveal.className}
          style={testimonialLeftReveal.style}
        >
          <p className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-gold">
            <span className="h-px w-7 bg-gold" />
            Client Stories
          </p>
          <blockquote
            className="relative pt-10 text-[clamp(28px,3.5vw,46px)] font-light italic leading-[1.4]"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            <span className="absolute -left-4 -top-5 text-[120px] not-italic leading-none text-[rgba(200,137,42,0.15)]">
              &quot;
            </span>
            {feedback?.message ||
              "Concept Builders did not just sell us a plan - they understood exactly how we wanted to live and translated that into every square metre."}
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--gold)_0%,#8b5e1a_100%)] text-[18px] font-semibold text-ink"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              {(feedback?.name?.[0] || "A").toUpperCase()}
            </div>
            <div>
              <p className="text-[14px] font-medium text-cream">
                {feedback?.name || "Amina Wanjiku"}
              </p>
              <p className="mt-1 text-[12px] tracking-[0.08em] text-cb-muted">
                Homeowner · Nairobi, Kenya
              </p>
            </div>
          </div>
        </div>

        <div
          ref={testimonialRightReveal.ref}
          className={testimonialRightReveal.className}
          style={testimonialRightReveal.style}
        >
          <div className="relative">
            <div className="relative overflow-hidden">
              <Image
                src={
                  bestSellingPlans[0]?.images?.[0]?.url ||
                  "https://concept-builders.sfo3.digitaloceanspaces.com/designs/1763456171240-A_13%20-%20Photo%20(8).jpg"
                }
                alt="Concept Builders project"
                width={900}
                height={1100}
                className="aspect-[4/5] w-full object-cover brightness-75 saturate-[0.8] transition duration-500 hover:brightness-90 hover:saturate-100"
              />
            </div>
            <div className="pointer-events-none absolute bottom-[-20px] left-[20px] right-[-20px] top-[20px] border border-gold/30" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-28 text-center lg:px-[60px] max-[900px]:px-6 max-[900px]:py-20">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(200,137,42,0.08)_0%,transparent_70%)]" />
        <div
          ref={ctaReveal.ref}
          className={ctaReveal.className}
          style={ctaReveal.style}
        >
          <p className="mb-5 text-[11px] uppercase tracking-[0.25em] text-gold">
            Begin Your Journey
          </p>
          <h2
            className="mb-6 text-[clamp(48px,7vw,96px)] font-light leading-none tracking-[-0.02em]"
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
          <div className="flex items-center justify-center gap-6 max-[900px]:flex-col">
            <Link
              href="/designs"
              className="group relative overflow-hidden bg-gold px-9 py-4 text-[13px] font-medium uppercase tracking-[0.14em] text-ink"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold-light transition-transform duration-300 group-hover:translate-x-0" />
              <span className="relative z-10">Browse All Plans</span>
            </Link>
            <Link
              href="/custom-design"
              className="group flex items-center gap-2.5 text-[13px] uppercase tracking-[0.12em] text-cream transition-colors hover:text-gold"
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
        <div className="mb-14 grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-14 max-[900px]:grid-cols-1">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center border border-gold rotate-45">
                <span className="h-2 w-2 bg-gold -rotate-45" />
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
