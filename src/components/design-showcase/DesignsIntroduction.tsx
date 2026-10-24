"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import styles from "./designs.module.css";

const perspectives = [
  {
    name: "The contemporary villa",
    category: "Maisonettes",
    image: "/images/landing/contemporary-villa.webp",
    alt: "Contemporary villa with natural stone walls, a timber pergola, and a sunlit garden",
    note: "A little more space. A whole new perspective.",
    label: "Considered spaces",
  },
  {
    name: "The courtyard bungalow",
    category: "Bungalows",
    image: "/images/landing/courtyard-bungalow.webp",
    alt: "Single-storey courtyard bungalow opening onto a landscaped garden at dusk",
    note: "Everyday living, beautifully grounded.",
    label: "Grounded living",
  },
  {
    name: "The urban apartment",
    category: "Apartments",
    image: "/images/landing/urban-apartment.webp",
    alt: "Contemporary apartment building with generous balconies and a stone-clad tower",
    note: "Fresh possibilities. A different point of view.",
    label: "New perspectives",
  },
];

export default function DesignsIntroduction() {
  const [active, setActive] = useState(0);
  const perspective = perspectives[active];

  function changePerspective(direction: number) {
    setActive(
      (previous) =>
        (previous + direction + perspectives.length) % perspectives.length,
    );
  }

  return (
    <section className={styles.hero} aria-labelledby="designs-heading">
      <div className={styles.heroImages} aria-hidden="true">
        {perspectives.map((item, index) => (
          <div
            key={item.image}
            className={styles.heroFrame}
            data-active={active === index}
          >
            <Image
              src={item.image}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              className={styles.heroImage}
            />
          </div>
        ))}
      </div>
      <div className={styles.heroTopline}>
        <p className={styles.eyebrow}>
          <span className={styles.shortRule} /> The house plan collection
        </p>
        <span>Imagined here. Made for your life.</span>
      </div>
      <div className={styles.heroCopy}>
        <p className={styles.heroOverline}>
          Every great home begins with a feeling.
        </p>
        <h1 id="designs-heading">
          See the space.
          <br />
          <em>Feel at home.</em>
        </h1>
        <p className={styles.heroDescription}>
          Find the architecture that moves you. Explore house plans designed
          around the way you want to live.
        </p>
        <a href="#plans-grid" className={styles.heroExplore}>
          Discover your home <ArrowDown size={17} aria-hidden="true" />
        </a>
      </div>
      <div className={styles.heroCaption} aria-live="polite" aria-atomic="true">
        <span className={styles.eyebrow}>
          In focus / {String(active + 1).padStart(2, "0")}
        </span>
        <Link
          href={`/designs?${new URLSearchParams({ category: perspective.category })}#plans-grid`}
          className={styles.heroCaptionLink}
        >
          <span>{perspective.name}</span>
          <ArrowUpRight size={24} strokeWidth={1.25} aria-hidden="true" />
        </Link>
        <p>{perspective.note}</p>
        <span className={styles.srOnly}>{perspective.alt}</span>
      </div>
      <div className={styles.heroFooter}>
        <span className={styles.heroFooterNote}>
          A different way to see home.
        </span>
        <div
          className={styles.perspectives}
          role="group"
          aria-label="Architectural inspiration"
        >
          {perspectives.map((item, index) => (
            <button
              key={item.image}
              type="button"
              aria-pressed={active === index}
              aria-label={`Show ${item.name}`}
              onClick={() => setActive(index)}
            >
              <span className={styles.perspectiveNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item.label}</span>
              <span className={styles.perspectiveLine} />
            </button>
          ))}
        </div>
        <div className={styles.heroArrows}>
          <button
            type="button"
            aria-label="Previous inspiration"
            onClick={() => changePerspective(-1)}
          >
            <ChevronLeft size={19} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next inspiration"
            onClick={() => changePerspective(1)}
          >
            <ChevronRight size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
