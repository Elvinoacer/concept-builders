"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import DetailImage from "./DetailImage";
import type { DetailPhoto } from "./detail-model";
import styles from "./detail.module.css";

export default function DetailLightbox({
  open,
  onOpenChange,
  images,
  index,
  onIndexChange,
  title,
  floorPlan = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: DetailPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  title: string;
  floorPlan?: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const returnFocus = useRef<HTMLElement | null>(null);

  function next(direction: number) {
    setZoom(1);
    onIndexChange((index + direction + images.length) % images.length);
  }
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.lightboxOverlay} />
        <Dialog.Content
          className={styles.lightbox}
          aria-describedby="detail-lightbox-description"
          onOpenAutoFocus={() => {
            returnFocus.current = document.activeElement as HTMLElement;
            setZoom(1);
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus.current?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              next(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
        >
          <div className={styles.lightboxHeader}>
            <div>
              <p className={styles.eyebrow}>
                {floorPlan ? "The floor plans" : "The image collection"}
              </p>
              <Dialog.Title>{title}</Dialog.Title>
            </div>
            <Dialog.Close
              className={styles.circleButton}
              aria-label="Close image viewer"
            >
              <X size={21} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <Dialog.Description
            id="detail-lightbox-description"
            className={styles.srOnly}
          >
            Use the arrow keys to explore views. Use the zoom controls for a
            closer look. Press Escape to close.
          </Dialog.Description>
          <div
            className={`${styles.lightboxCanvas} ${floorPlan ? styles.lightboxPlan : ""}`}
          >
            <div className={styles.zoomScroll}>
              <div
                className={styles.zoomFrame}
                style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
              >
                {images[index] && (
                  <DetailImage
                    src={images[index].url}
                    alt={`${title}, view ${index + 1}`}
                    contain
                    sizes="100vw"
                    priority
                  />
                )}
              </div>
            </div>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.circleButton} ${styles.viewerPrevious}`}
                  aria-label="Previous image"
                  onClick={() => next(-1)}
                >
                  <ChevronLeft size={22} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`${styles.circleButton} ${styles.viewerNext}`}
                  aria-label="Next image"
                  onClick={() => next(1)}
                >
                  <ChevronRight size={22} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
          <div className={styles.lightboxFooter}>
            <span aria-live="polite">
              {String(index + 1).padStart(2, "0")}{" "}
              <span className={styles.muted}>
                / {String(images.length).padStart(2, "0")}
              </span>
            </span>
            <div
              className={styles.zoomControls}
              role="group"
              aria-label="Image zoom"
            >
              <button
                type="button"
                aria-label="Zoom out"
                disabled={zoom <= 1}
                onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
              >
                <Minus size={17} aria-hidden="true" />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={zoom >= 3}
                onClick={() => setZoom((z) => Math.min(3, z + 0.5))}
              >
                <Plus size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Reset zoom"
                onClick={() => setZoom(1)}
              >
                <RotateCcw size={16} aria-hidden="true" />
              </button>
            </div>
            <span className={styles.viewerHint}>
              A closer look, at your own pace.
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
