"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type Direction = "plans" | "custom" | "unsure" | null;

export default function PlanGuide() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [direction, setDirection] = useState<Direction>(null);
  const [bedrooms, setBedrooms] = useState("");

  const destination =
    direction === "plans"
      ? "/designs" + (bedrooms ? "?bedrooms=" + encodeURIComponent(bedrooms) : "")
      : direction === "custom"
        ? "/custom-design" + (bedrooms ? "?beds=" + encodeURIComponent(bedrooms) : "")
        : "#talk-to-us";
  const actionLabel =
    direction === "plans"
      ? "See matching plans"
      : direction === "custom"
        ? "Start a custom design"
        : "Talk to our team";

  return (
    <>
      <button className="cb-guide-trigger" type="button" onClick={() => dialogRef.current?.showModal()}>
        Help me choose <span aria-hidden="true">↗</span>
      </button>
      <dialog
        ref={dialogRef}
        className="cb-guide-dialog"
        aria-labelledby="guide-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="cb-guide-content">
          <div className="cb-guide-top">
            <span className="cb-index">A simple place to start</span>
            <button type="button" className="cb-guide-close" aria-label="Close guide" onClick={() => dialogRef.current?.close()}>×</button>
          </div>
          <h2 id="guide-title">Let’s find your <em>starting point.</em></h2>
          <p>Choose what sounds closest. You can always change direction later.</p>
          <div className="cb-guide-options" role="group" aria-label="What are you looking for?">
            {[
              { value: "plans", title: "Show me existing plans", detail: "I want to explore designs and compare options." },
              { value: "custom", title: "Design something for me", detail: "I have a plot, a brief or a specific idea." },
              { value: "unsure", title: "I’m not sure yet", detail: "I’d rather talk through the possibilities." },
            ].map((option) => (
              <button
                type="button"
                key={option.value}
                className={"cb-guide-option" + (direction === option.value ? " is-selected" : "")}
                aria-pressed={direction === option.value}
                onClick={() => setDirection(option.value as Direction)}
              >
                <span className="cb-guide-option-title">{option.title}</span>
                <span>{option.detail}</span>
              </button>
            ))}
          </div>
          {(direction === "plans" || direction === "custom") && (
            <label className="cb-guide-bedrooms">
              How many bedrooms are you thinking of? <span>(optional)</span>
              <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}>
                <option value="">I’m still deciding</option>
                <option value="2">2 bedrooms</option>
                <option value="3">3 bedrooms</option>
                <option value="4+">4 or more bedrooms</option>
              </select>
            </label>
          )}
          <Link
            className={"cb-button cb-button-gold cb-guide-result" + (!direction ? " is-disabled" : "")}
            href={direction ? destination : "#"}
            aria-disabled={!direction}
            tabIndex={direction ? 0 : -1}
            onClick={(event) => {
              if (!direction) event.preventDefault();
              else dialogRef.current?.close();
            }}
          >
            {actionLabel} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </dialog>
    </>
  );
}
