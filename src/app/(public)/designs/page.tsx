import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, Check, MoveUpRight } from "lucide-react";
import DesignsExplorer from "@/components/design-showcase/DesignsExplorer";
import styles from "@/components/design-showcase/designs.module.css";

export const metadata: Metadata = {
  title: "House Plans & Designs",
  description:
    "Find a house plan that feels like home. Explore Concept Builders' architectural designs and filter by style, bedrooms, floor area, and budget.",
};

export default function AllDesignsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="designs-heading">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <span className={styles.shortRule} /> The house plan collection
          </p>
          <h1 id="designs-heading">
            Good design.
            <br />
            <em>Great beginnings.</em>
          </h1>
          <p className={styles.heroDescription}>
            Your next chapter starts with a plan. Discover thoughtfully designed
            homes and find the one that feels like you.
          </p>
          <div className={styles.heroNotes}>
            <span>
              <Check size={13} aria-hidden="true" /> Architect-designed
            </span>
            <span>
              <Check size={13} aria-hidden="true" /> Made for Kenyan living
            </span>
          </div>
        </div>
        <Link href="/custom-design" className={styles.heroVisual}>
          <Image
            src="/images/landing/modern-bungalow.webp"
            alt="Contemporary bungalow with a landscaped garden"
            fill
            sizes="(max-width: 767px) 0px, (max-width: 1023px) 40vw, 42vw"
            className={styles.heroImage}
            priority
          />
          <span className={styles.heroVisualTop}>
            A little inspiration, a world of possibility.
          </span>
          <span className={styles.heroVisualBottom}>
            <span>
              <small>Something uniquely yours?</small>Let&apos;s design it
              together.
            </span>
            <ArrowUpRight size={23} aria-hidden="true" />
          </span>
        </Link>
      </section>
      <Suspense
        fallback={
          <div className={styles.explorerLoading}>
            Preparing the collection…
          </div>
        }
      >
        <DesignsExplorer />
      </Suspense>
      <section
        className={styles.customBanner}
        aria-label="Custom house designs"
      >
        <div className={styles.customIcon}>
          <MoveUpRight size={30} strokeWidth={1} aria-hidden="true" />
        </div>
        <div>
          <p className={styles.eyebrow}>
            Your land. Your lifestyle. Your home.
          </p>
          <h2>
            Love a plan, but want to <em>make it yours?</em>
          </h2>
          <p>
            We can adapt a design to your needs, or start with a blank page.
          </p>
        </div>
        <Link href="/custom-design" className={styles.outlineButton}>
          Talk to our team <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
