import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import DesignsExplorer from "@/components/design-showcase/DesignsExplorer";
import DesignsIntroduction from "@/components/design-showcase/DesignsIntroduction";
import styles from "@/components/design-showcase/designs.module.css";

export const metadata: Metadata = {
  title: "House Plans & Designs",
  description:
    "Find a house plan that feels like home. Explore Concept Builders' architectural designs and filter by style, bedrooms, floor area, and budget.",
};

export default function AllDesignsPage() {
  return (
    <div className={styles.page}>
      <DesignsIntroduction />
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
        <div className={styles.customImage}>
          <Image
            src="/images/landing/modern-bungalow.webp"
            alt="Stone-clad bungalow with a covered terrace and a lush garden"
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
          />
          <span>A home, with your name on it.</span>
        </div>
        <div className={styles.customCopy}>
          <p className={styles.eyebrow}>Beyond the collection</p>
          <h2>
            Your life doesn&apos;t
            <br />
            follow a template.
            <br />
            <em>Neither should your home.</em>
          </h2>
          <p>
            A different layout. A little more room. Something entirely you.
            Let&apos;s adapt a plan to your land and lifestyle, or imagine
            something new together.
          </p>
          <Link href="/custom-design" className={styles.outlineButton}>
            Create something yours <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
