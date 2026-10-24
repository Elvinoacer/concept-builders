"use client";

import Image from "next/image";
import { useState } from "react";
import { House } from "lucide-react";
import { designImageUrl } from "@/lib/design-media";
import styles from "./detail.module.css";

export default function DetailImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  contain = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  contain?: boolean;
}) {
  const source = designImageUrl(src);
  const [direct, setDirect] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  if (failed.includes(source))
    return (
      <span
        className={styles.imageFallback}
        role="img"
        aria-label={`Preview unavailable: ${alt}`}
      >
        <House size={36} strokeWidth={1} aria-hidden="true" />
        <span>This view is taking a little longer.</span>
        <small>Try another perspective in the gallery.</small>
      </span>
    );
  return (
    <Image
      src={source}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={contain ? styles.containedImage : styles.coverImage}
      unoptimized={direct.includes(source)}
      onError={() => {
        if (source.startsWith("https://") && !direct.includes(source))
          setDirect((previous) => [...previous, source]);
        else setFailed((previous) => [...previous, source]);
      }}
    />
  );
}
