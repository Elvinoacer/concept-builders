"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Expand,
  Pause,
  Play,
} from "lucide-react";
import {
  planFacts,
  type LandingImage,
  type LandingPlan,
  type PreviewHandler,
} from "@/lib/landing-designs";
import "./CinematicHero.css";

type HeroSlide = { key: string; plan: LandingPlan; image: LandingImage };
const HOLD_MS = 7600;

function buildSlides(
  lead: LandingPlan,
  collection: LandingPlan[],
): HeroSlide[] {
  const homes = new Set<string>();
  const images = new Set<string>();
  const slides: HeroSlide[] = [];
  for (const plan of [lead, ...collection]) {
    const identity = plan.id ?? plan.name;
    const image = plan.images[0];
    if (!image || homes.has(identity) || images.has(image.url)) continue;
    homes.add(identity);
    images.add(image.url);
    slides.push({ key: `${identity}:${image.url}`, plan, image });
    if (slides.length === 5) break;
  }
  if (slides.length === 1) {
    for (const image of lead.images.slice(1, 4)) {
      if (!images.has(image.url)) {
        slides.push({
          key: `${lead.id ?? lead.name}:${image.url}`,
          plan: lead,
          image,
        });
        images.add(image.url);
      }
    }
  }
  return slides;
}

function headline(name: string) {
  const code = name.match(/\s*\((CB[\w-]+)\)\s*$/i)?.[1];
  const title = name.replace(/\s*\(CB[\w-]+\)\s*$/i, "").trim();
  return {
    code,
    title:
      title === title.toUpperCase()
        ? title.charAt(0) + title.slice(1).toLowerCase()
        : title,
  };
}

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
  const slides = useMemo(
    () => buildSlides(plan, collection),
    [plan, collection],
  );
  const [active, setActive] = useState(slides[0]);
  const [previous, setPrevious] = useState<HeroSlide | null>(null);
  const [requestedKey, setRequestedKey] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [systemReduced, setSystemReduced] = useState(false);
  const [motionChoice, setMotionChoice] = useState<boolean | null>(null);
  const [entered, setEntered] = useState(false);
  const firstTransition = useRef(true);
  const index = Math.max(
    0,
    slides.findIndex((slide) => slide.key === active.key),
  );
  const next = slides[(index + 1) % slides.length];
  const motionEnabled = motionChoice ?? !systemReduced;
  const playing = motionEnabled && !paused && inView && pageVisible;
  const name = headline(active.plan.name);
  const facts = planFacts(active.plan);

  useEffect(() => {
    const timer = window.setTimeout(() => setEntered(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () =>
      setSystemReduced(media.matches || Boolean(connection?.saveData));
    update();
    media.addEventListener("change", update);
    try {
      const saved = localStorage.getItem("cb:cinema-motion:v1");
      if (saved === "on" || saved === "off") setMotionChoice(saved === "on");
    } catch {
      /* This visit still supports the motion control without storage. */
    }
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(root);
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // A streamed catalog update also waits for its first image before replacing
  // the editorial opening. The entrance itself remains mounted throughout.
  useEffect(() => {
    const current = slides.find((slide) => slide.key === active.key);
    if (!current) setRequestedKey(slides[0].key);
    else setActive(current);
  }, [slides, active.key]);

  // The current image stays visible until the requested image is decoded.
  useEffect(() => {
    if (
      paused ||
      !pageVisible ||
      !inView ||
      !requestedKey ||
      !loaded.has(requestedKey)
    )
      return;
    const target = slides.find((slide) => slide.key === requestedKey);
    if (!target) {
      setRequestedKey(null);
      return;
    }
    setPrevious(active);
    setActive(target);
    setRequestedKey(null);
    firstTransition.current = false;
  }, [requestedKey, loaded, slides, active, paused, pageVisible, inView]);

  useEffect(() => {
    if (
      !playing ||
      slides.length < 2 ||
      !loaded.has(active.key) ||
      requestedKey
    )
      return;
    const timer = window.setTimeout(
      () => {
        for (let offset = 1; offset < slides.length; offset++) {
          const target = slides[(index + offset) % slides.length];
          if (!failed.has(target.key)) {
            setRequestedKey(target.key);
            break;
          }
        }
      },
      HOLD_MS + (firstTransition.current ? 1300 : 0),
    );
    return () => window.clearTimeout(timer);
  }, [playing, slides, index, active.key, loaded, requestedKey, failed]);

  function selectSlide(targetIndex: number) {
    const direction = targetIndex < index ? -1 : 1;
    const target = Array.from(
      { length: slides.length },
      (_, offset) =>
        slides[
          (targetIndex + direction * offset + slides.length * 2) % slides.length
        ],
    ).find((slide) => !failed.has(slide.key));
    if (!target) return;
    if (target.key === active.key) {
      setRequestedKey(null);
      return;
    }
    setRequestedKey(target.key);
  }

  function toggleMotion() {
    const choice = !motionEnabled;
    setMotionChoice(choice);
    try {
      localStorage.setItem("cb:cinema-motion:v1", choice ? "on" : "off");
    } catch {
      /* Storage is optional. */
    }
  }

  const mounted = new Map<string, HeroSlide>();
  if (previous) mounted.set(previous.key, previous);
  mounted.set(active.key, active);
  if (loaded.has(active.key) && next.key !== active.key)
    mounted.set(next.key, next);
  const requested = slides.find((slide) => slide.key === requestedKey);
  if (requested) mounted.set(requested.key, requested);

  return (
    <section
      ref={rootRef}
      className="film-hero"
      id="hero"
      data-entered={entered}
      data-playing={playing}
      data-motion={motionEnabled ? "enabled" : "reduced"}
      aria-label="Discover our house plans"
      onKeyDown={(event) => {
        if (event.altKey || event.metaKey || event.ctrlKey) return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          selectSlide(index + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          selectSlide(index - 1);
        }
      }}
    >
      <div className="film-hero__images">
        {[...mounted.values()].map((slide) => (
          <div
            key={slide.key}
            className="film-hero__image"
            data-active={slide.key === active.key}
            data-outgoing={slide.key === previous?.key}
            aria-hidden={slide.key !== active.key}
          >
            <Image
              src={slide.image.url}
              alt={slide.plan.name}
              fill
              sizes="100vw"
              priority={slide.key === slides[0].key}
              loading={slide.key === slides[0].key ? undefined : "eager"}
              className="film-hero__photo"
              onLoad={() =>
                setLoaded((current) =>
                  current.has(slide.key)
                    ? current
                    : new Set(current).add(slide.key),
                )
              }
              onError={() => {
                setFailed((current) => new Set(current).add(slide.key));
                setRequestedKey((current) =>
                  current === slide.key ? null : current,
                );
              }}
            />
          </div>
        ))}
      </div>
      <div className="film-hero__shade" aria-hidden="true" />
      <div className="film-hero__entrance" aria-hidden="true">
        <div className="film-hero__entrance-brand">
          Concept Builders<span>Considered from the beginning.</span>
        </div>
      </div>
      <div className="film-hero__overline">
        <span>Architecture for the way you live</span>
        <span>Kenya · Designed around you</span>
      </div>
      <div
        className="film-hero__headline"
        key={active.plan.id ?? active.plan.name}
      >
        <p className="film-hero__category">
          {active.plan.category}
          {name.code && (
            <>
              <span />
              {name.code}
            </>
          )}
        </p>
        <h1 aria-label={active.plan.name}>
          {name.title.split(/\s+/).map((word, wordIndex) => (
            <Fragment key={`${word}-${wordIndex}`}>
              {wordIndex > 0 && " "}
              <span className="film-hero__word-mask">
                <span style={{ "--word-index": wordIndex } as CSSProperties}>
                  {word}
                </span>
              </span>
            </Fragment>
          ))}
        </h1>
        <p className="film-hero__description">
          Beautiful, practical house plans. A place to make your own.
        </p>
      </div>
      <div className="film-hero__actions">
        <button
          type="button"
          className="film-hero__preview"
          onClick={() =>
            onPreview(
              active.plan,
              collection.some(
                (home) =>
                  (home.id ?? home.name) ===
                  (active.plan.id ?? active.plan.name),
              )
                ? collection
                : [active.plan, ...collection],
            )
          }
        >
          <span>Experience this home</span>
          <Expand size={15} aria-hidden="true" />
        </button>
        <a href="#explorer">
          Explore house plans <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="film-hero__bottom">
        <div className="film-hero__detail">
          <span>
            {facts.length
              ? facts.join(" · ")
              : "Your land. Your family. Your home."}
          </span>
          <a href="#consultation-form">
            Begin your own story <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        </div>
        <a href="#featured" className="film-hero__scroll">
          <span>Discover more</span>
          <ArrowDown size={15} aria-hidden="true" />
        </a>
        <div
          className="film-hero__controls"
          aria-label="Featured home slideshow"
        >
          <button
            type="button"
            aria-label="Previous featured home"
            disabled={slides.length < 2}
            onClick={() => selectSlide(index - 1)}
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
          <span className="film-hero__counter">
            {String(index + 1).padStart(2, "0")}
            <span> / {String(slides.length).padStart(2, "0")}</span>
          </span>
          <button
            type="button"
            aria-label="Next featured home"
            disabled={slides.length < 2}
            onClick={() => selectSlide(index + 1)}
          >
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="film-hero__motion"
            aria-label={
              motionEnabled ? "Pause hero animation" : "Play hero animation"
            }
            aria-pressed={motionEnabled}
            onClick={toggleMotion}
          >
            {motionEnabled ? (
              <Pause size={12} aria-hidden="true" />
            ) : (
              <Play size={12} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {failed.has(active.key) && (
        <p className="film-hero__notice">
          Explore this home’s available views in the full preview.
        </p>
      )}
    </section>
  );
}
