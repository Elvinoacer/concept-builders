"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Expand,
  FileText,
  Heart,
  House,
  Images,
  Layers3,
  Ruler,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { designImageUrl } from "@/lib/design-media";
import { imageLabel } from "@/lib/landing-designs";
import { DesignViewTracker } from "@/components/design-detail/DesignViewTracker";
import DetailImage from "@/components/design-detail/DetailImage";
import DetailLightbox from "@/components/design-detail/DetailLightbox";
import DetailPurchasePanel from "@/components/design-detail/DetailPurchasePanel";
import {
  documentOptions,
  floorPlanName,
  planName,
  planPrice,
  packageTotal,
  type DesignDetailPayload,
  type DetailPhoto,
  type NeighborDesignPayload,
  type RelatedDesignPayload,
} from "@/components/design-detail/detail-model";
import styles from "@/components/design-detail/detail.module.css";

export type {
  DesignDetailPayload,
  RelatedDesignPayload,
  NeighborDesignPayload,
} from "@/components/design-detail/detail-model";
const SAVED_KEY = "concept-builders:saved-plans:v1";
const sections = [
  { id: "design-overview", label: "The design", number: "01" },
  { id: "design-floorplans", label: "Floor plans", number: "02" },
  { id: "design-included", label: "The drawing set", number: "03" },
  { id: "design-faq", label: "Your questions", number: "04" },
];
function savedPlans(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export default function DesignDetailClient({
  designId,
  initialDesign: design,
  initialRelated: related,
  initialNeighbors: neighbors = { prev: null, next: null },
}: {
  designId: string;
  initialDesign: DesignDetailPayload;
  initialRelated: RelatedDesignPayload[];
  initialNeighbors?: NeighborDesignPayload;
}) {
  const router = useRouter();
  const { status } = useSession();
  const { addToCart, cart } = useCart();
  const { title, code } = planName(design.name);
  const titleWords = title.split(" ");
  const photos = useMemo(() => {
    const seen = new Set<string>();
    return design.images.filter((image): image is DetailPhoto => {
      if (!image.url || image.type !== "IMAGE" || seen.has(image.url))
        return false;
      seen.add(image.url);
      return true;
    });
  }, [design.images]);
  const floorPlans = design.floorPlans.filter((file): file is DetailPhoto =>
    Boolean(file.url),
  );
  const floorPlanImages = floorPlans.filter(
    (file) => file.type !== "PDF" && !/\.pdf(?:[?#]|$)/i.test(file.url),
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [activeFloor, setActiveFloor] = useState(0);
  const [viewer, setViewer] = useState<"photos" | "plans" | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("design-overview");
  const [saved, setSaved] = useState(false);
  const options = useMemo(() => documentOptions(design), [design]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>(() =>
    design.architecturalDesign?.pdfFiles?.length ? ["architecturalPdf"] : [],
  );
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const selectedExtras = design.packageOptions.filter((option) =>
    extraIds.includes(option.id),
  );
  const total = packageTotal(
    design.basePrice,
    options,
    selectedFiles,
    selectedExtras,
  );
  const customHref = `/custom-design?${new URLSearchParams({ designId: design.id, imageUrl: design.images[0]?.url || "" })}`;
  const currentPhoto = photos[imageIndex];
  const description = /[a-z]{3}/i.test(design.description)
    ? design.description
    : null;
  const faqs = useMemo(
    () =>
      Array.isArray(design.faq)
        ? design.faq.filter(
            (item): item is { question: string; answer: string } =>
              Boolean(
                item &&
                  typeof item === "object" &&
                  typeof item.question === "string" &&
                  typeof item.answer === "string",
              ),
          )
        : [],
    [design.faq],
  );
  const facts = [
    { label: "Bedrooms", value: design.bedrooms, icon: BedDouble },
    { label: "Bathrooms", value: design.bathrooms, icon: Bath },
    {
      label: "Floor area",
      value: design.area ? `${design.area.toLocaleString()} m²` : null,
      icon: Ruler,
    },
    {
      label: design.floors === 1 ? "Floor" : "Floors",
      value: design.floors,
      icon: Layers3,
    },
  ].filter((fact) => fact.value != null);

  useEffect(() => {
    setSaved(savedPlans().includes(designId));
  }, [designId]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActiveSection(entry.target.id);
      },
      { rootMargin: "-170px 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const rate = data?.rates?.KES;
        if (typeof rate === "number" && Number.isFinite(rate) && rate > 0)
          setExchangeRate(rate);
      })
      .catch(() => {});
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);
  function selectPhoto(index: number) {
    if (photos.length) setImageIndex((index + photos.length) % photos.length);
  }
  function openPhoto(index: number) {
    setImageIndex(index);
    setViewerIndex(index);
    setViewer("photos");
  }
  function showPlans() {
    document.getElementById("purchase-options")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }
  function toggleSaved() {
    const next = !saved;
    try {
      const ids = savedPlans().filter((id) => id !== designId);
      if (next) ids.push(designId);
      localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
      setSaved(next);
      toast.success(
        next ? "Saved on this device." : "Removed from saved plans.",
      );
    } catch {
      toast.error(
        "Your browser could not save this plan. You can copy its link instead.",
      );
    }
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/designs/${designId}`,
      );
      toast.success("Design link copied.");
    } catch {
      toast.error(
        "The link could not be copied. You can copy it from your address bar.",
      );
    }
  }
  function toggleFile(key: string) {
    const option = options.find((item) => item.key === key);
    if (!option?.available || option.included) return;
    setSelectedFiles((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key],
    );
  }
  function toggleExtra(id: string) {
    setExtraIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }
  async function handleAdd() {
    if (adding || buying) return;
    setAdding(true);
    try {
      const added = await addToCart(design, selectedFiles, selectedExtras);
      if (added && status === "unauthenticated")
        toast.info(
          "Your plan is saved in the cart. Sign in when you’re ready to check out.",
        );
    } catch {
      toast.error("We couldn’t add your plan. Please try again.");
    } finally {
      setAdding(false);
    }
  }
  async function handleBuy() {
    if (adding || buying) return;
    setBuying(true);
    try {
      const existing = cart.some(
        (item) =>
          item.design.id === design.id &&
          JSON.stringify([...(item.selectedFileTypes || [])].sort()) ===
            JSON.stringify([...selectedFiles].sort()) &&
          JSON.stringify(
            (item.selectedExtras || []).map((extra) => extra.id).sort(),
          ) === JSON.stringify([...extraIds].sort()),
      );
      const added = await addToCart(design, selectedFiles, selectedExtras);
      if (!added && !existing) {
        toast.error(
          "Your plan could not be prepared for checkout. Please try again.",
        );
        return;
      }
      router.push(
        status === "authenticated"
          ? "/checkout"
          : "/auth?callbackUrl=%2Fcheckout",
      );
    } catch {
      toast.error("Checkout could not be opened. Please try again.");
    } finally {
      setBuying(false);
    }
  }

  return (
    <div className={styles.page}>
      <DesignViewTracker designId={design.id} />
      <div className={styles.breadcrumbBar}>
        <nav aria-label="Breadcrumb">
          <Link href="/designs">
            <ArrowLeft size={14} aria-hidden="true" />
            The collection
          </Link>
          <span>/</span>
          {design.category?.name && (
            <>
              <Link
                href={`/designs?${new URLSearchParams({ category: design.category.name })}`}
              >
                {design.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span aria-current="page">{code || title}</span>
        </nav>
        <div className={styles.pageActions}>
          <button
            type="button"
            onClick={toggleSaved}
            aria-pressed={saved}
            aria-label={
              saved ? "Unsave this design" : "Save this design on this device"
            }
          >
            <Heart
              size={16}
              fill={saved ? "currentColor" : "none"}
              aria-hidden="true"
            />
            <span>{saved ? "Saved" : "Save"}</span>
          </button>
          <button
            type="button"
            onClick={() => void copyLink()}
            aria-label="Copy design link"
          >
            <Copy size={15} aria-hidden="true" />
            <span>Share</span>
          </button>
        </div>
      </div>
      <header className={styles.introduction}>
        <div>
          <p className={styles.eyebrow}>
            <span />
            {design.category?.name || "The house plan collection"}
            {code && ` / ${code}`}
          </p>
          <h1>
            {titleWords.slice(0, -1).join(" ")}
            {titleWords.length > 1 ? " " : ""}
            <em>{titleWords.at(-1)}</em>
          </h1>
        </div>
        <div className={styles.introductionAside}>
          <p>
            A new perspective.
            <br />
            <span>Your next place to call home.</span>
          </p>
          <a href="#purchase-options" className={styles.introCta}>
            {design.basePrice > 0 ? (
              <>
                <span>
                  House plan from{" "}
                  <strong>
                    {planPrice(design.basePrice)} <small>USD</small>
                  </strong>
                </span>
                <ArrowUpRight size={24} strokeWidth={1.2} aria-hidden="true" />
              </>
            ) : (
              <>
                Explore the possibilities{" "}
                <ArrowUpRight size={22} aria-hidden="true" />
              </>
            )}
          </a>
        </div>
      </header>
      <section
        className={styles.gallerySection}
        aria-label="Explore the architecture"
      >
        <div
          className={`${styles.heroMosaic} ${photos.length < 2 ? styles.singlePhoto : ""}`}
        >
          <div className={styles.mainPhoto}>
            {currentPhoto ? (
              <>
                <button
                  type="button"
                  className={styles.photoButton}
                  aria-label={`Enlarge ${title}, view ${imageIndex + 1}`}
                  onClick={() => openPhoto(imageIndex)}
                >
                  <DetailImage
                    src={currentPhoto.url}
                    alt={`${title} — ${imageLabel(currentPhoto, imageIndex)}`}
                    priority
                    sizes="(max-width: 767px) 100vw, 72vw"
                  />
                </button>
                <span className={styles.photoCaption}>
                  <span>
                    {String(imageIndex + 1).padStart(2, "0")} /{" "}
                    {String(photos.length).padStart(2, "0")}
                  </span>
                  <span>{imageLabel(currentPhoto, imageIndex)}</span>
                </span>
                <button
                  type="button"
                  className={styles.expandButton}
                  onClick={() => openPhoto(imageIndex)}
                >
                  <Expand size={15} aria-hidden="true" />
                  Take a closer look
                </button>
              </>
            ) : (
              <div className={styles.emptyImage}>
                <House size={46} strokeWidth={1} aria-hidden="true" />
                <span>Explore the details of this home below.</span>
              </div>
            )}
            {photos.length > 1 && (
              <div className={styles.mainImageArrows}>
                <button
                  type="button"
                  className={styles.circleButton}
                  aria-label="Previous perspective"
                  onClick={() => selectPhoto(imageIndex - 1)}
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.circleButton}
                  aria-label="Next perspective"
                  onClick={() => selectPhoto(imageIndex + 1)}
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
          {photos.length > 1 && (
            <div className={styles.sidePhotos}>
              {[1, 2].slice(0, photos.length - 1).map((offset) => {
                const index = (imageIndex + offset) % photos.length;
                return (
                  <button
                    key={offset}
                    type="button"
                    aria-label={`Enlarge alternate view ${index + 1}`}
                    onClick={() => openPhoto(index)}
                  >
                    <DetailImage
                      src={photos[index].url}
                      alt={`${title} — alternate perspective ${index + 1}`}
                      sizes="(max-width: 767px) 0px, 28vw"
                    />
                    <span>
                      {imageLabel(photos[index], index)}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {photos.length > 0 && (
          <div className={styles.galleryBottom}>
            <div className={styles.galleryNote}>
              <span className={styles.eyebrow}>
                The architecture, from every angle
              </span>
              <p>Stay a little. Picture life here.</p>
            </div>
            <div
              className={styles.thumbnailStrip}
              role="group"
              aria-label="Choose a perspective"
            >
              {photos.map((photo, index) => (
                <button
                  type="button"
                  key={photo.id}
                  aria-label={`Show perspective ${index + 1}`}
                  aria-pressed={imageIndex === index}
                  onClick={() => selectPhoto(index)}
                >
                  <DetailImage src={photo.url} alt="" sizes="90px" />
                </button>
              ))}
            </div>
            <button
              type="button"
              className={styles.galleryAll}
              onClick={() => openPhoto(imageIndex)}
            >
              <Images size={17} aria-hidden="true" />
              <span>All {photos.length} photos</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
      {facts.length > 0 && (
        <dl className={styles.factRibbon}>
          {facts.map((fact) => (
            <div key={fact.label}>
              <fact.icon size={20} strokeWidth={1.25} aria-hidden="true" />
              <div>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      )}
      <nav className={styles.sectionNav} aria-label="Design sections">
        <div>
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setActiveSection(section.id)}
              aria-current={
                activeSection === section.id ? "location" : undefined
              }
            >
              <span>{section.number}</span>
              {section.label}
            </a>
          ))}
          <a href="#purchase-options" className={styles.navPurchase}>
            Choose your plan <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>
      <div className={styles.detailLayout}>
        <div className={styles.story}>
          <section id="design-overview" className={styles.storySection}>
            <p className={styles.eyebrow}>
              <span />
              01 / The design
            </p>
            <h2>
              Room for your
              <br />
              <em>next chapter.</em>
            </h2>
            <p className={styles.description}>
              {description ||
                `Explore the perspectives, floor plans, and drawing options for this home. Find the details that make it a fit for the way you want to live.`}
            </p>
            {design.planDetails.length > 0 && (
              <ul className={styles.featureList}>
                {design.planDetails.map((detail, index) => (
                  <li key={`${detail}-${index}`}>
                    <Check size={15} aria-hidden="true" />
                    {detail}
                  </li>
                ))}
              </ul>
            )}
            {photos.length > 2 && (
              <figure className={styles.storyFigure}>
                <button
                  type="button"
                  aria-label="Enlarge the architectural detail"
                  onClick={() => openPhoto(Math.min(3, photos.length - 1))}
                >
                  <DetailImage
                    src={photos[Math.min(3, photos.length - 1)].url}
                    alt={`${title} — another perspective`}
                    sizes="(max-width: 1023px) 100vw, 60vw"
                  />
                  <span>
                    <Expand size={16} aria-hidden="true" />
                  </span>
                </button>
                <figcaption>
                  <span>A closer look at the architecture.</span>
                  <span>{code || design.category?.name}</span>
                </figcaption>
              </figure>
            )}
          </section>
          <section id="design-floorplans" className={styles.storySection}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>
                  <span />
                  02 / The layout
                </p>
                <h2>
                  See how life
                  <br />
                  <em>fits inside.</em>
                </h2>
              </div>
              <span className={styles.sectionSideNote}>
                The spaces.
                <br />
                The connections.
                <br />
                The everyday possibilities.
              </span>
            </div>
            {floorPlans.length > 0 ? (
              <>
                <div
                  className={styles.floorTabs}
                  role="group"
                  aria-label="Choose a floor plan"
                >
                  {floorPlans.map((file, index) => (
                    <button
                      key={file.id}
                      type="button"
                      aria-pressed={activeFloor === index}
                      onClick={() => setActiveFloor(index)}
                    >
                      <Layers3 size={15} aria-hidden="true" />
                      {floorPlanName(file, index)}
                    </button>
                  ))}
                </div>
                <div className={styles.floorCanvas}>
                  {floorPlans[activeFloor].type === "PDF" ||
                  /\.pdf(?:[?#]|$)/i.test(floorPlans[activeFloor].url) ? (
                    <div className={styles.planPdf}>
                      <FileText size={42} strokeWidth={1} aria-hidden="true" />
                      <p>
                        {floorPlanName(floorPlans[activeFloor], activeFloor)}
                      </p>
                      <a
                        href={floorPlans[activeFloor].url}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.darkButton}
                      >
                        Open floor plan PDF{" "}
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </a>
                    </div>
                  ) : (
                    <button
                      type="button"
                      aria-label="Enlarge floor plan"
                      className={styles.floorImageButton}
                      onClick={() => {
                        setViewerIndex(
                          floorPlanImages.findIndex(
                            (file) => file.id === floorPlans[activeFloor].id,
                          ),
                        );
                        setViewer("plans");
                      }}
                    >
                      <DetailImage
                        src={floorPlans[activeFloor].url}
                        alt={`${title} — ${floorPlanName(floorPlans[activeFloor], activeFloor)}`}
                        contain
                        sizes="(max-width: 1023px) 100vw, 60vw"
                      />
                    </button>
                  )}
                </div>
                <div className={styles.floorFootnote}>
                  <span>
                    <Ruler size={14} aria-hidden="true" /> Explore the layout
                    before you choose.
                  </span>
                  {floorPlanImages.some(
                    (file) => file.id === floorPlans[activeFloor].id,
                  ) && (
                    <button
                      type="button"
                      onClick={() => {
                        setViewerIndex(
                          floorPlanImages.findIndex(
                            (file) => file.id === floorPlans[activeFloor].id,
                          ),
                        );
                        setViewer("plans");
                      }}
                    >
                      <Expand size={15} aria-hidden="true" />
                      Expand & zoom
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.emptyPlans}>
                <Layers3 size={34} strokeWidth={1} aria-hidden="true" />
                <h3>Let’s talk through the layout.</h3>
                <p>
                  Ask our team for a floor plan preview and guidance on whether
                  this design suits your site.
                </p>
                <Link
                  href={`/contact?designId=${design.id}`}
                  className={styles.textLink}
                >
                  Ask about the floor plans{" "}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            )}
          </section>
          <section id="design-included" className={styles.storySection}>
            <p className={styles.eyebrow}>
              <span />
              03 / From idea to drawings
            </p>
            <h2>
              The details behind
              <br />
              <em>the dream.</em>
            </h2>
            <p className={styles.sectionDescription}>
              See which documents are available for this home. Build your
              drawing set around the next steps for your project.
            </p>
            <div className={styles.documentInventory}>
              {options.map((option) => (
                <div key={option.key} data-available={option.available}>
                  <span className={styles.documentIcon}>
                    <FileText size={20} strokeWidth={1.25} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{option.label}</h3>
                    <p>{option.description}</p>
                  </div>
                  <span className={styles.documentStatus}>
                    {option.available
                      ? option.included
                        ? "Included"
                        : "Optional"
                      : "Unavailable"}
                  </span>
                </div>
              ))}
            </div>
            <a href="#purchase-options" className={styles.textLink}>
              Choose your drawing set{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </section>
          <section id="design-faq" className={styles.storySection}>
            <p className={styles.eyebrow}>
              <span />
              04 / A little clarity
            </p>
            <h2>
              Good questions.
              <br />
              <em>Thoughtful answers.</em>
            </h2>
            {faqs.length > 0 ? (
              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <details key={`${faq.question}-${index}`}>
                    <summary>
                      <span>{faq.question}</span>
                      <PlusIcon />
                    </summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            ) : (
              <p className={styles.sectionDescription}>
                Wondering about your plot, the drawing options, or adapting the
                layout? Bring your questions to our team.
              </p>
            )}
            <Link
              href={`/contact?designId=${design.id}`}
              className={styles.textLink}
            >
              Talk about this design{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
        <DetailPurchasePanel
          design={design}
          options={options}
          selectedFiles={selectedFiles}
          selectedExtras={extraIds}
          total={total}
          exchangeRate={exchangeRate}
          onToggleFile={toggleFile}
          onToggleExtra={toggleExtra}
          onAdd={() => void handleAdd()}
          onBuy={() => void handleBuy()}
          adding={adding}
          buying={buying}
          customHref={customHref}
        />
      </div>
      <section
        className={`${styles.adaptSection} ${photos.length ? "" : styles.adaptWithoutImage}`}
        aria-labelledby="adapt-heading"
      >
        {photos.length > 0 && (
          <div className={styles.adaptImage}>
            <DetailImage
              src={photos[Math.min(4, photos.length - 1)].url}
              alt={`${title}, ready to be adapted to your life`}
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </div>
        )}
        <div className={styles.adaptCopy}>
          <p className={styles.eyebrow}>Your land. Your way of living.</p>
          <h2 id="adapt-heading">
            A little different.
            <br />
            <em>A lot more you.</em>
          </h2>
          <p>
            Love the architecture, but have a few ideas of your own? Let’s
            explore how this design can work for your plot and the life you want
            to build.
          </p>
          <Link href={customHref} className={styles.secondaryButton}>
            Adapt this design <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
      {related.length > 0 && (
        <section
          className={styles.relatedSection}
          aria-labelledby="related-heading"
        >
          <div className={styles.relatedHeading}>
            <div>
              <p className={styles.eyebrow}>
                <span />
                Keep an open mind
              </p>
              <h2 id="related-heading">
                Another way
                <br />
                <em>to feel at home.</em>
              </h2>
            </div>
            <Link
              href={`/designs${design.category?.name ? `?${new URLSearchParams({ category: design.category.name })}` : ""}`}
              className={styles.textLink}
            >
              Explore the collection{" "}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.relatedGrid}>
            {related.slice(0, 3).map((item) => {
              const thumbnail =
                item.images?.find(
                  (image) =>
                    image.url && designImageUrl(image.url).startsWith("/"),
                ) || item.images?.find((image) => image.url);
              const name = planName(item.name);
              return (
                <Link
                  key={item.id}
                  href={`/designs/${item.id}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImage}>
                    {thumbnail?.url ? (
                      <DetailImage
                        src={thumbnail.url}
                        alt={name.title}
                        sizes="(max-width: 767px) 90vw, 33vw"
                      />
                    ) : (
                      <span className={styles.emptyImage}>
                        <House size={35} strokeWidth={1} aria-hidden="true" />
                      </span>
                    )}
                    <span>
                      <ArrowUpRight size={21} aria-hidden="true" />
                    </span>
                  </div>
                  <p>
                    {item.category?.name || "House plan"}
                    <span>{name.code}</span>
                  </p>
                  <h3>{name.title}</h3>
                  <div className={styles.relatedFacts}>
                    <span>
                      {[
                        item.bedrooms != null ? `${item.bedrooms} beds` : null,
                        item.area ? `${item.area.toLocaleString()} m²` : null,
                      ]
                        .filter(Boolean)
                        .join(" / ")}
                    </span>
                    <strong>
                      {item.basePrice > 0
                        ? planPrice(item.basePrice)
                        : "Custom design"}
                    </strong>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
      {(neighbors.prev || neighbors.next) && (
        <nav
          className={styles.neighborNav}
          aria-label="More designs in this style"
        >
          {neighbors.prev ? (
            <Link href={`/designs/${neighbors.prev.id}`}>
              <ArrowLeft size={20} aria-hidden="true" />
              <span>
                <small>Previous in the collection</small>
                {planName(neighbors.prev.name).title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {neighbors.next ? (
            <Link href={`/designs/${neighbors.next.id}`}>
              <span>
                <small>Next in the collection</small>
                {planName(neighbors.next.name).title}
              </span>
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
      <div className={styles.mobilePurchase}>
        <span>
          <small>
            {design.basePrice > 0
              ? "Your selected plan · USD"
              : "Make it your own"}
          </small>
          <strong>
            {design.basePrice > 0 ? planPrice(total) : "Let’s talk"}
          </strong>
        </span>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={showPlans}
        >
          {design.basePrice > 0 ? "Choose your plan" : "Discuss this design"}
          <ArrowUpRight size={17} aria-hidden="true" />
        </button>
      </div>
      <DetailLightbox
        open={viewer !== null}
        onOpenChange={(open) => {
          if (!open) setViewer(null);
        }}
        images={viewer === "plans" ? floorPlanImages : photos}
        index={viewerIndex}
        onIndexChange={(index) => {
          setViewerIndex(index);
          if (viewer === "photos") setImageIndex(index);
        }}
        title={title}
        floorPlan={viewer === "plans"}
      />
    </div>
  );
}
function PlusIcon() {
  return (
    <span className={styles.faqToggle} aria-hidden="true">
      <span />
      <span />
    </span>
  );
}
