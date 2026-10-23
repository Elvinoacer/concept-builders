"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Expand } from "lucide-react";
import {
  planDestination,
  planFacts,
  type LandingPlan,
  type PreviewHandler,
} from "@/lib/landing-designs";

export function HomeCard({
  plan,
  collection,
  onPreview,
  large = false,
}: {
  plan: LandingPlan;
  collection: LandingPlan[];
  onPreview: PreviewHandler;
  large?: boolean;
}) {
  const facts = planFacts(plan);
  return (
    <article className={`home-card${large ? " home-card--large" : ""}`}>
      <button
        type="button"
        className="home-card__image"
        onClick={() => onPreview(plan, collection)}
        aria-label={`Preview ${plan.name}`}
      >
        <Image
          src={plan.images[0].url}
          alt={plan.name}
          fill
          sizes={
            large
              ? "(max-width: 760px) 94vw, 60vw"
              : "(max-width: 600px) 94vw, (max-width: 1100px) 46vw, 30vw"
          }
          className="home-card__render"
        />
        <span className="home-card__preview">
          <Expand size={15} aria-hidden="true" /> Full preview
        </span>
      </button>
      <div className="home-card__details">
        <div className="home-card__category">{plan.category}</div>
        <h3>
          <button type="button" onClick={() => onPreview(plan, collection)}>
            {plan.name}
          </button>
        </h3>
        <div className="home-card__bottom">
          <p>
            {facts.length
              ? facts.join(" · ")
              : plan.id
                ? "Explore every perspective"
                : `${plan.images.length} architectural perspectives`}
          </p>
          <Link
            href={planDestination(plan)}
            aria-label={`${plan.id ? "View plan details for" : "Request a design like"} ${plan.name}`}
          >
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Featured({
  plans,
  onPreview,
}: {
  plans: LandingPlan[];
  onPreview: PreviewHandler;
}) {
  const [category, setCategory] = useState("All homes");
  const categories = [
    "All homes",
    ...new Set(plans.map((plan) => plan.category)),
  ];
  const activeCategory = categories.includes(category) ? category : "All homes";
  const visible =
    activeCategory === "All homes"
      ? plans
      : plans.filter((plan) => plan.category === activeCategory);
  return (
    <section
      className="home-featured"
      id="featured"
      aria-labelledby="featured-heading"
    >
      <div className="home-section-heading">
        <div>
          <p className="home-eyebrow">
            <span /> A different way to live
          </p>
          <h2 id="featured-heading">
            Find the one that
            <br />
            feels like <em>you.</em>
          </h2>
        </div>
        <div className="home-section-aside">
          <p>
            Different lives. Different plots.
            <br />A considered design for each.
          </p>
          <ArrowDownRight size={34} strokeWidth={1} aria-hidden="true" />
        </div>
      </div>
      <div className="home-filters" aria-label="Featured home categories">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={activeCategory === item}
            onClick={() => setCategory(item)}
          >
            {item}
            <span>
              {item === "All homes"
                ? plans.length
                : plans.filter((p) => p.category === item).length}
            </span>
          </button>
        ))}
      </div>
      <div className="home-featured__grid">
        {visible.slice(0, 3).map((plan, index) => (
          <HomeCard
            key={plan.id ?? plan.name}
            plan={plan}
            large={index === 0}
            collection={visible}
            onPreview={onPreview}
          />
        ))}
      </div>
      <div className="home-section-footer">
        <p>Take a closer look. Every home opens in full.</p>
        <Link href="/designs">
          Explore the collection <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
