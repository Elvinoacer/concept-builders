"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Expand,
  MoveUpRight,
  Pause,
  Play,
} from "lucide-react";
import {
  imageLabel,
  planFacts,
  type LandingPlan,
  type PreviewHandler,
} from "@/lib/landing-designs";

const CHAPTERS = [
  {
    title: "A place to arrive.",
    copy: "Architecture for the way you want to live.",
    name: "Arrival",
  },
  {
    title: "Consider every angle.",
    copy: "Discover the character of a home, one perspective at a time.",
    name: "Perspective",
  },
  {
    title: "See the bigger picture.",
    copy: "Space. Form. A new point of view.",
    name: "Discovery",
  },
  {
    title: "Imagine life here.",
    copy: "A considered beginning. A home to make your own.",
    name: "At home",
  },
];

export default function DreamPlan({
  plan,
  collection,
  onPreview,
  paused,
}: {
  plan: LandingPlan;
  collection: LandingPlan[];
  onPreview: PreviewHandler;
  paused: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [posterReady, setPosterReady] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  const [motionChoice, setMotionChoice] = useState<boolean | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const views = useMemo(() => plan.images.slice(0, 4), [plan.images]);
  const motionEnabled = (motionChoice ?? !systemReduced) && views.length > 1;
  const currentView = Math.min(active, views.length - 1);
  const facts = planFacts(plan);
  const chapter =
    CHAPTERS[
      views.length === 1
        ? 0
        : Math.round((currentView / (views.length - 1)) * 3)
    ];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () =>
      setSystemReduced(preference.matches || Boolean(connection?.saveData));
    update();
    preference.addEventListener("change", update);
    try {
      const stored = localStorage.getItem("cb:cinema-motion:v1");
      if (stored === "on" || stored === "off") setMotionChoice(stored === "on");
    } catch {
      /* Motion preferences are optional when browser storage is unavailable. */
    }
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const header = document.querySelector("header");
    const measure = () =>
      root.style.setProperty(
        "--cinema-header",
        `${header?.getBoundingClientRect().height ?? 88}px`,
      );
    measure();
    const observer = new ResizeObserver(measure);
    if (header) observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    let inView = false;
    const invitation = root.querySelector<HTMLElement>(
      ".home-cinema__invitation",
    );
    if (invitation && !motionEnabled) invitation.inert = false;
    const paint = () => {
      frame = 0;
      if (!inView || document.hidden || paused || !motionEnabled) return;
      const rect = root.getBoundingClientRect();
      const header =
        parseFloat(root.style.getPropertyValue("--cinema-header")) || 88;
      const distance = Math.max(
        1,
        root.offsetHeight - (window.innerHeight - header),
      );
      const progress = Math.max(0, Math.min(1, (header - rect.top) / distance));
      const position = Math.max(
        0,
        Math.min(
          views.length - 1,
          ((progress - 0.12) / 0.76) * (views.length - 1),
        ),
      );
      const base = Math.floor(position);
      const blend = Math.max(0, Math.min(1, (position - base - 0.55) / 0.45));
      views.forEach((_, index) =>
        root.style.setProperty(
          `--view-${index}`,
          String(index <= base ? 1 : index === base + 1 ? blend : 0),
        ),
      );
      root.style.setProperty("--story-progress", String(progress));
      root.style.setProperty(
        "--intro-opacity",
        String(Math.max(0, 1 - progress * 4)),
      );
      if (invitation) invitation.inert = progress >= 0.25;
      root.style.setProperty(
        "--intro-shift",
        `${Math.min(progress * 180, 45)}px`,
      );
      root.style.setProperty(
        "--image-top",
        `${Math.max(40, 200 - progress * 390)}px`,
      );
      root.style.setProperty(
        "--image-left",
        `${Math.max(5, 41 - progress * 80)}%`,
      );
      const next = Math.min(views.length - 1, base + (blend > 0.5 ? 1 : 0));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    };
    const schedule = () => {
      if (!frame && inView && !document.hidden && !paused && motionEnabled)
        frame = requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) schedule();
      },
      { rootMargin: "100px" },
    );
    observer.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [motionEnabled, paused, views]);

  function selectView(index: number) {
    const root = rootRef.current;
    if (!root) return;
    if (!motionEnabled) {
      activeRef.current = index;
      setActive(index);
      views.forEach((_, i) =>
        root.style.setProperty(`--view-${i}`, String(i <= index ? 1 : 0)),
      );
      return;
    }
    const header =
      parseFloat(root.style.getPropertyValue("--cinema-header")) || 88;
    const distance = root.offsetHeight - (window.innerHeight - header);
    const fraction =
      views.length <= 1 ? 0 : 0.12 + (index / (views.length - 1)) * 0.76;
    window.scrollTo({
      top:
        window.scrollY +
        root.getBoundingClientRect().top -
        header +
        distance * fraction,
      behavior: systemReduced ? "instant" : "smooth",
    });
  }

  function toggleMotion() {
    const next = !motionEnabled;
    setMotionChoice(next);
    try {
      localStorage.setItem("cb:cinema-motion:v1", next ? "on" : "off");
    } catch {
      /* Preference still applies for this visit. */
    }
    if (!next && rootRef.current) {
      // Keep the viewport stable when collapsing the long sticky section.
      const header =
        parseFloat(rootRef.current.style.getPropertyValue("--cinema-header")) ||
        88;
      const top = Math.max(
        0,
        window.scrollY + rootRef.current.getBoundingClientRect().top - header,
      );
      if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" });
    }
  }

  return (
    <section
      ref={rootRef}
      className="home-cinema"
      id="hero"
      data-motion={motionEnabled ? "enabled" : "reduced"}
      aria-label="Discover a home from every perspective"
    >
      <div className="home-cinema__stage">
        <div className="home-cinema__intro">
          <p className="home-eyebrow">
            <span /> Architecture for real life
          </p>
          <h1>
            A better house.
            <br />A better <em>beginning.</em>
          </h1>
        </div>
        <div className="home-cinema__invitation">
          <p>
            Beautiful, practical house plans.
            <br />
            Considered around your life.
          </p>
          <div>
            <a href="#explorer">
              Explore house plans <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a href="#consultation-form">
              Design my home <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="home-cinema__visual">
          <div className="home-cinema__frame-line" aria-hidden="true" />
          {views.map(
            (image, index) =>
              (index === 0 ||
                index === currentView ||
                index === currentView - 1 ||
                (posterReady && index === currentView + 1)) && (
                <div
                  className="home-cinema__frame"
                  key={image.url}
                  style={{
                    opacity: index === 0 ? 1 : `var(--view-${index}, 0)`,
                  }}
                  aria-hidden={currentView !== index}
                >
                  <Image
                    src={image.url}
                    alt={`${plan.name} — ${imageLabel(image, index)}`}
                    fill
                    sizes="(max-width: 760px) 94vw, (max-width: 1600px) 90vw, 1440px"
                    priority={index === 0}
                    loading={index === 0 ? undefined : "eager"}
                    className="home-cinema__render"
                    onLoad={() => {
                      if (index === 0) setPosterReady(true);
                    }}
                    onError={() => setImageFailed(true)}
                  />
                </div>
              ),
          )}
          <span className="home-cinema__index" aria-hidden="true">
            {String(currentView + 1).padStart(2, "0")}
            <span> / {String(views.length).padStart(2, "0")}</span>
          </span>
          <button
            type="button"
            className="home-cinema__expand"
            onClick={() =>
              onPreview(
                plan,
                collection.some((p) => p.id === plan.id && p.name === plan.name)
                  ? collection
                  : [plan, ...collection],
              )
            }
          >
            <Expand size={16} aria-hidden="true" />
            <span>Experience this home</span>
          </button>
          {imageFailed && (
            <p className="home-cinema__image-note">
              Explore available perspectives in the full preview.
            </p>
          )}
        </div>
        <div className="home-cinema__caption">
          <div className="home-cinema__chapter" aria-live="polite">
            <span>
              {String(currentView + 1).padStart(2, "0")} — {chapter.name}
            </span>
            <h2>{chapter.title}</h2>
            <p>{chapter.copy}</p>
          </div>
          <div className="home-cinema__identity">
            <p>{plan.category}</p>
            <h3>{plan.name}</h3>
            {facts.length > 0 && <span>{facts.join(" · ")}</span>}
          </div>
        </div>
        <div className="home-cinema__footer">
          <a href="#featured" className="home-cinema__scroll">
            <ArrowDown size={14} aria-hidden="true" />
            <span>
              {motionEnabled ? "Scroll to discover" : "Discover more homes"}
            </span>
          </a>
          <div
            className="home-cinema__chapters"
            aria-label="House perspectives"
          >
            {views.map((view, index) => (
              <button
                type="button"
                key={view.url}
                aria-label={`Show ${imageLabel(view, index)}`}
                aria-pressed={currentView === index}
                onClick={() => selectView(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="home-cinema__motion"
            aria-pressed={motionEnabled}
            onClick={toggleMotion}
          >
            {motionEnabled ? (
              <Pause size={12} aria-hidden="true" />
            ) : (
              <Play size={12} aria-hidden="true" />
            )}
            <span>Motion {motionEnabled ? "on" : "off"}</span>
          </button>
        </div>
        <div className="home-cinema__progress" aria-hidden="true" />
      </div>
      <div className="home-cinema__after">
        <a href="#explorer">
          Explore house plans <MoveUpRight size={16} aria-hidden="true" />
        </a>
        <a href="#consultation-form">
          Design my home <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
