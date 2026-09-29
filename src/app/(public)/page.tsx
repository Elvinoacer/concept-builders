import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import PlanGuide from "@/components/landing/PlanGuide";
import QuickInquiry from "@/components/landing/QuickInquiry";
import "./Home.css";

export const metadata: Metadata = {
  title: "House Plans in Kenya",
  description:
    "Explore house plans for Kenyan homes, find a design that fits your needs, or ask Concept Builders for a custom architectural design.",
};

const getLandingData = unstable_cache(
  async () => {
    const [designs, count, categories] = await Promise.all([
      prisma.design.findMany({
        select: {
          id: true,
          name: true,
          bedrooms: true,
          category: { select: { name: true } },
          images: {
            where: { type: "IMAGE" },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { url: true },
          },
        },
        orderBy: [
          { isFeatured: "desc" },
          { featuredPriority: "desc" },
          { views: "desc" },
        ],
        take: 12,
      }),
      prisma.design.count(),
      prisma.category.findMany({
        select: { name: true },
        orderBy: { name: "asc" },
      }),
    ]);
    return { designs, count, categories };
  },
  ["landing-discovery-v1"],
  { revalidate: 300, tags: ["landing-data", "designs", "featured-designs"] },
);

const arrow = (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

export default async function LandingPage() {
  const { designs, count, categories } = await getLandingData();
  const pictured = designs.filter((design) => Boolean(design.images[0]?.url));
  const selected = (pictured.length >= 3 ? pictured : designs).slice(0, 3);
  const categoryNames = categories.map((category) => category.name);
  const highlightedCategories = [
    ...categoryNames.filter((name) => /bungalow|maisonette|apartment/i.test(name)),
    ...categoryNames.filter((name) => !/bungalow|maisonette|apartment/i.test(name)),
  ].slice(0, 4);

  return (
    <div className="cb-home">
      <section className="cb-hero" aria-labelledby="home-title">
        <div className="cb-hero-copy">
          <p className="cb-kicker"><span /> Architecture for life in Kenya</p>
          <h1 id="home-title">A place to call <em>your own</em> starts with a plan.</h1>
          <p className="cb-hero-lede">
            Discover a home design that feels right for your family and your plot.
            Browse our house plans or work with us on something made for you.
          </p>
          <div className="cb-hero-actions">
            <a className="cb-button cb-button-dark" href="#find-a-plan">Find a house plan {arrow}</a>
            <PlanGuide />
          </div>
          <p className="cb-hero-reassurance">
            Already have an idea? <Link href="/custom-design">Tell us about your project {arrow}</Link>
          </p>
        </div>
        <div className="cb-hero-visual">
          <Image
            src="/images/banners/banner1.webp"
            alt="Contemporary home design by Concept Builders"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 55vw"
            className="cb-hero-image"
          />
          <div className="cb-hero-image-caption">
            <span>Imagine the possibilities</span>
            <span>Explore · Refine · Build</span>
          </div>
        </div>
      </section>

      <section className="cb-finder" id="find-a-plan" aria-labelledby="finder-title">
        <div className="cb-container cb-finder-inner">
          <div className="cb-finder-heading">
            <span className="cb-index">01 / Find your direction</span>
            <div>
              <h2 id="finder-title">What does your next home look like?</h2>
              <p>Start with a few details. You can refine the results at any time.</p>
            </div>
          </div>
          <form className="cb-finder-form" action="/designs" method="get" role="search">
            <label>
              <span>Search designs</span>
              <input type="search" name="search" placeholder="e.g. modern bungalow" />
            </label>
            <label>
              <span>Bedrooms</span>
              <select name="bedrooms" defaultValue="">
                <option value="">Any number</option>
                <option value="2">2 bedrooms</option>
                <option value="3">3 bedrooms</option>
                <option value="4+">4 or more</option>
              </select>
            </label>
            <label>
              <span>Style</span>
              <select name="category" defaultValue="">
                <option value="">All styles</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
            </label>
            <button className="cb-button cb-button-gold" type="submit">Show designs {arrow}</button>
          </form>
          {highlightedCategories.length > 0 && (
            <div className="cb-quick-links" aria-label="Popular styles">
              <span>Or explore by style</span>
              {highlightedCategories.map((name) => (
                <Link key={name} href={"/designs?category=" + encodeURIComponent(name)}>
                  {name} {arrow}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="cb-featured" aria-labelledby="featured-title">
        <div className="cb-container">
          <div className="cb-section-heading">
            <div>
              <span className="cb-index">02 / Get inspired</span>
              <h2 id="featured-title">Find a design you can <em>see yourself in.</em></h2>
            </div>
            <Link className="cb-text-link" href="/designs">
              Browse {count > 0 ? "all " + count + " designs" : "all designs"} {arrow}
            </Link>
          </div>
          {selected.length > 0 ? (
            <div className="cb-plan-grid">
              {selected.map((design, index) => (
                <Link className="cb-plan-card" href={"/designs/" + design.id} key={design.id}>
                  <div className="cb-plan-image">
                    <Image
                      src={design.images[0]?.url || "/images/banners/banner2.webp"}
                      alt={design.name}
                      fill
                      sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw"
                    />
                    <span className="cb-plan-number">0{index + 1}</span>
                    <span className="cb-plan-open" aria-hidden="true">{arrow}</span>
                  </div>
                  <div className="cb-plan-meta">
                    <span>{design.category?.name || "House plan"}</span>
                    {design.bedrooms != null && <span>{design.bedrooms} bedrooms</span>}
                  </div>
                  <h3>{design.name}</h3>
                  <span className="cb-plan-view">View design {arrow}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="cb-empty-plans">
              <p>Our design gallery is being updated. Tell us what you have in mind and we can help you take the next step.</p>
              <Link className="cb-text-link" href="/custom-design">Discuss a custom design {arrow}</Link>
            </div>
          )}
        </div>
      </section>

      <section className="cb-paths" aria-labelledby="paths-title">
        <div className="cb-container">
          <span className="cb-index">03 / Choose your path</span>
          <h2 id="paths-title">Your starting point is <em>up to you.</em></h2>
          <div className="cb-path-grid">
            <Link className="cb-path cb-path-ready" href="/designs">
              <span className="cb-path-label">Explore the collection</span>
              <h3>Find a plan that fits.</h3>
              <p>Browse real designs, compare layouts and save time by starting with a plan you love.</p>
              <span className="cb-path-action">View house plans {arrow}</span>
            </Link>
            <Link className="cb-path cb-path-custom" href="/custom-design">
              <span className="cb-path-label">Made around your vision</span>
              <h3>Make it entirely yours.</h3>
              <p>Share your plot, ideas and priorities. We’ll help shape them into a custom design brief.</p>
              <span className="cb-path-action">Request a custom design {arrow}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="cb-process" aria-labelledby="process-title">
        <div className="cb-container cb-process-grid">
          <div>
            <span className="cb-index">04 / What happens next</span>
            <h2 id="process-title">From “what if” to <em>what’s possible.</em></h2>
            <p>There’s no need to know every detail before you get in touch. We can begin with where you are.</p>
            <Link className="cb-text-link" href="/ongoing-projects">See our projects {arrow}</Link>
          </div>
          <ol>
            <li><span>01</span><div><h3>Explore</h3><p>Find inspiration in the gallery, or share an idea you’ve been carrying.</p></div></li>
            <li><span>02</span><div><h3>Talk it through</h3><p>Tell us about your plot, household, priorities and the questions you have.</p></div></li>
            <li><span>03</span><div><h3>Plan with clarity</h3><p>Discuss the design approach and drawings that suit your project.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="cb-contact" id="talk-to-us" aria-labelledby="contact-title">
        <div className="cb-container cb-contact-grid">
          <div className="cb-contact-intro">
            <span className="cb-index">05 / Start a conversation</span>
            <h2 id="contact-title">Tell us what you want to <em>build.</em></h2>
            <p>A rough idea is enough. Share a little about your project and we’ll follow up to discuss the next step.</p>
            <div className="cb-contact-options">
              <a href="https://wa.me/254741360865" target="_blank" rel="noopener noreferrer">Chat on WhatsApp {arrow}</a>
              <a href="tel:+254741360865">Call +254 741 360 865 {arrow}</a>
            </div>
          </div>
          <QuickInquiry />
        </div>
      </section>
    </div>
  );
}
