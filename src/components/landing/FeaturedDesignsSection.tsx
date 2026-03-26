import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

type DesignItem = {
  id: string;
  name: string;
  views?: number;
  category?: {
    name: string;
  } | null;
  images?: Array<{ url: string }>;
};

const REVALIDATE_SECONDS = 300;

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${proto}://${host}`;
  }

  return (
    process.env.NEXT_PUBLIC_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  );
}

async function getBestSellingPlans() {
  try {
    const baseUrl = await getBaseUrl();
    const designsRes = await fetch(
      `${baseUrl}/api/designs?limit=12&mode=cursor&includeTotals=false&lite=true`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );

    if (!designsRes.ok) {
      return [] as DesignItem[];
    }

    const designsPayload = await designsRes.json();
    const designs: DesignItem[] = Array.isArray(designsPayload?.designs)
      ? designsPayload.designs
      : [];

    return [...designs]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3);
  } catch {
    return [] as DesignItem[];
  }
}

export default async function FeaturedDesignsSection() {
  const bestSellingPlans = await getBestSellingPlans();

  return (
    <section className="border-b border-cb-border px-6 py-24 lg:px-[60px] max-[900px]:px-6 max-[900px]:py-16">
      <div className="reveal visible" style={{ transitionDelay: "0ms" }}>
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
                    "/images/category-placeholder.webp"
                  }
                  alt={design.name}
                  fill
                  className="object-cover brightness-[0.85] saturate-90 transition duration-500 group-hover:scale-105 group-hover:brightness-95 group-hover:saturate-100"
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
              <div className="p-5 sm:p-8">
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
          className="reveal visible mt-12 flex items-center justify-between gap-6 max-[900px]:flex-col max-[900px]:items-start"
          style={{ transitionDelay: "100ms" }}
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
  );
}
