"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { HomeCard } from "./Featured";
import type { LandingPlan, PreviewHandler } from "@/lib/landing-designs";

export default function Explorer({
  plans,
  totalDesignCount,
  onPreview,
}: {
  plans: LandingPlan[];
  totalDesignCount: number;
  onPreview: PreviewHandler;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [expanded, setExpanded] = useState(false);
  const categories = [...new Set(plans.map((plan) => plan.category))];
  const bedOptions = [
    ...new Set(plans.flatMap((plan) => (plan.bedrooms ? [plan.bedrooms] : []))),
  ].sort((a, b) => a - b);
  const filtered = useMemo(
    () =>
      plans.filter(
        (plan) =>
          (!category || plan.category === category) &&
          (!bedrooms || plan.bedrooms === Number(bedrooms)) &&
          (!query ||
            `${plan.name} ${plan.category}`
              .toLowerCase()
              .includes(query.toLowerCase().trim())),
      ),
    [plans, category, bedrooms, query],
  );
  const visible = expanded ? filtered : filtered.slice(0, 6);
  function reset() {
    setQuery("");
    setCategory("");
    setBedrooms("");
    setExpanded(false);
  }

  return (
    <section
      className="home-explorer"
      id="explorer"
      aria-labelledby="explorer-heading"
    >
      <div className="home-section-heading">
        <div>
          <p className="home-eyebrow">
            <span /> The plan library
          </p>
          <h2 id="explorer-heading">
            Your place starts
            <br />
            with a <em>possibility.</em>
          </h2>
        </div>
        <div className="home-section-aside">
          <p>
            Explore by style and space.
            <br />
            Find what works for your life.
          </p>
        </div>
      </div>
      <div className="home-explorer__controls">
        <label className="home-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search home designs</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setExpanded(false);
            }}
            placeholder="Find your kind of home"
          />
        </label>
        <label>
          <span className="sr-only">Architectural style</span>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setExpanded(false);
            }}
          >
            <option value="">All styles</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        {bedOptions.length > 0 && (
          <label>
            <span className="sr-only">Number of bedrooms</span>
            <select
              value={bedrooms}
              onChange={(e) => {
                setBedrooms(e.target.value);
                setExpanded(false);
              }}
            >
              <option value="">Any bedrooms</option>
              {bedOptions.map((bed) => (
                <option value={bed} key={bed}>
                  {bed} bedrooms
                </option>
              ))}
            </select>
          </label>
        )}
        <span className="home-results" aria-live="polite">
          <SlidersHorizontal size={14} aria-hidden="true" />
          {filtered.length} homes
          {totalDesignCount > plans.length ? ` of ${totalDesignCount}` : ""}
        </span>
      </div>
      {visible.length ? (
        <div className="home-explorer__grid">
          {visible.map((plan) => (
            <HomeCard
              key={plan.id ?? plan.name}
              plan={plan}
              collection={filtered}
              onPreview={onPreview}
            />
          ))}
        </div>
      ) : (
        <div className="home-empty">
          <p>No homes match those preferences.</p>
          <button type="button" onClick={reset}>
            Clear filters and explore again
          </button>
        </div>
      )}
      <div className="home-section-footer">
        {filtered.length > 6 && !expanded ? (
          <button type="button" onClick={() => setExpanded(true)}>
            Show more homes <span>({filtered.length - 6})</span>
          </button>
        ) : (
          <p>Have something else in mind? We can design it around you.</p>
        )}
        <Link href="/designs">
          View all house plans <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
