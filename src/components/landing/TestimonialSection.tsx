import Image from "next/image";
import { headers } from "next/headers";

type FeaturedFeedback = {
  name: string;
  message: string;
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

async function getFeaturedFeedback() {
  try {
    const baseUrl = await getBaseUrl();
    const feedbackRes = await fetch(`${baseUrl}/api/featured-feedback`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!feedbackRes.ok) {
      return null as FeaturedFeedback | null;
    }

    const payload = await feedbackRes.json();
    if (Array.isArray(payload) && payload.length > 0) {
      return {
        name: payload[0].name,
        message: payload[0].message,
      };
    }

    return null as FeaturedFeedback | null;
  } catch {
    return null as FeaturedFeedback | null;
  }
}

export default async function TestimonialSection() {
  const feedback = await getFeaturedFeedback();

  return (
    <section className="grid grid-cols-2 items-center gap-24 border-b border-cb-border px-5 py-16 sm:px-6 sm:py-28 lg:px-[60px] max-[900px]:grid-cols-1 max-[900px]:gap-10">
      <div className="reveal visible" style={{ transitionDelay: "0ms" }}>
        <p className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-gold">
          <span className="h-px w-7 bg-gold" />
          Client Stories
        </p>
        <blockquote
          className="relative pt-10 text-[clamp(22px,5vw,46px)] font-light italic leading-[1.4] sm:text-[clamp(28px,3.5vw,46px)]"
          style={{
            fontFamily:
              'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
          }}
        >
          <span className="absolute -left-2 -top-3 text-[80px] not-italic leading-none text-[rgba(200,137,42,0.15)] sm:-left-4 sm:-top-5 sm:text-[120px]">
            &quot;
          </span>
          {feedback?.message ||
            "Concept Builders did not just sell us a plan - they understood exactly how we wanted to live and translated that into every square metre."}
        </blockquote>
        <div className="mt-8 flex items-center gap-4">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--gold)_0%,var(--gold-light)_100%)] text-[18px] font-semibold text-ink"
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

      <div className="reveal visible" style={{ transitionDelay: "200ms" }}>
        <div className="relative">
          <div className="relative overflow-hidden">
            <Image
              src="/images/banners/banner4.webp"
              alt="Concept Builders project"
              width={900}
              height={1100}
              className="aspect-[4/5] w-full object-cover brightness-75 saturate-[0.8] transition duration-500 hover:brightness-90 hover:saturate-100"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="pointer-events-none absolute bottom-[-10px] left-[10px] right-[-10px] top-[10px] border border-gold/30 sm:bottom-[-20px] sm:left-[20px] sm:right-[-20px] sm:top-[20px]" />
        </div>
      </div>
    </section>
  );
}
