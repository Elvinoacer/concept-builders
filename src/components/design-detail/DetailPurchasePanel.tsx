"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Download,
  LoaderCircle,
  ShoppingBag,
} from "lucide-react";
import {
  planPrice,
  type DesignDetailPayload,
  type DocumentOption,
} from "./detail-model";
import styles from "./detail.module.css";

export default function DetailPurchasePanel({
  design,
  options,
  selectedFiles,
  selectedExtras,
  total,
  exchangeRate,
  onToggleFile,
  onToggleExtra,
  onAdd,
  onBuy,
  adding,
  buying,
  customHref,
}: {
  design: DesignDetailPayload;
  options: DocumentOption[];
  selectedFiles: string[];
  selectedExtras: string[];
  total: number;
  exchangeRate: number | null;
  onToggleFile: (key: string) => void;
  onToggleExtra: (id: string) => void;
  onAdd: () => void;
  onBuy: () => void;
  adding: boolean;
  buying: boolean;
  customHref: string;
}) {
  const selectedOptions = options.filter(
    (option) => !option.included && selectedFiles.includes(option.key),
  );
  const extras = design.packageOptions.filter((option) =>
    selectedExtras.includes(option.id),
  );
  const isQuote = design.basePrice === 0;
  return (
    <aside
      id="purchase-options"
      className={styles.purchasePanel}
      aria-labelledby="purchase-heading"
    >
      <div className={styles.purchaseContents}>
        <p className={styles.eyebrow}>From inspiration to your own home</p>
        <h2 id="purchase-heading">
          Make the first <em>move.</em>
        </h2>
        <div className={styles.basePrice}>
          <span>
            {isQuote ? "Let’s talk about your project." : "House plan · USD"}
          </span>
          <strong>
            {isQuote ? "Made for you" : planPrice(design.basePrice)}
          </strong>
        </div>
        {isQuote ? (
          <p className={styles.purchaseIntro}>
            Tell us about your land and what you have in mind. Our team can help
            shape this design around you.
          </p>
        ) : (
          <>
            <p className={styles.purchaseIntro}>
              {options[0].available
                ? "The architectural PDF is included. Add the drawings and documents your project needs."
                : "Choose from the available drawings below, or ask our team about this plan."}
            </p>
            {options[0].available && (
              <div className={styles.includedNote}>
                <Check size={15} aria-hidden="true" />
                <span>
                  Architectural PDF <small>Included in your plan</small>
                </span>
                <Download size={16} aria-hidden="true" />
              </div>
            )}
            <details className={styles.packageDisclosure}>
              <summary>
                <span>
                  Personalize your drawing set
                  <small>
                    {selectedOptions.length + extras.length
                      ? `${selectedOptions.length + extras.length} optional items selected`
                      : "Optional drawings & extras"}
                  </small>
                </span>
                <ChevronDown size={17} aria-hidden="true" />
              </summary>
              <div className={styles.packageOptions}>
                {options
                  .filter((option) => !option.included)
                  .map((option) => (
                    <label
                      key={option.key}
                      className={styles.packageOption}
                      data-disabled={!option.available}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(option.key)}
                        disabled={!option.available}
                        onChange={() => onToggleFile(option.key)}
                      />
                      <span>
                        <strong>{option.label}</strong>
                        <small>
                          {option.available
                            ? option.description
                            : "Currently unavailable"}
                        </small>
                      </span>
                      <b>
                        {option.available
                          ? option.price > 0
                            ? `+ ${planPrice(option.price)}`
                            : "No extra charge"
                          : "—"}
                      </b>
                    </label>
                  ))}
                {design.packageOptions.length > 0 && (
                  <p className={styles.optionGroupLabel}>Additional options</p>
                )}
                {design.packageOptions.map((option) => (
                  <label key={option.id} className={styles.packageOption}>
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(option.id)}
                      onChange={() => onToggleExtra(option.id)}
                    />
                    <span>
                      <strong>{option.name}</strong>
                      {option.description && (
                        <small>{option.description}</small>
                      )}
                    </span>
                    <b>
                      {option.price > 0
                        ? `+ ${planPrice(option.price)}`
                        : "No extra charge"}
                    </b>
                  </label>
                ))}
              </div>
            </details>
            {(selectedOptions.length > 0 || extras.length > 0) && (
              <dl className={styles.priceBreakdown}>
                <div>
                  <dt>Base plan</dt>
                  <dd>{planPrice(design.basePrice)}</dd>
                </div>
                {[
                  ...selectedOptions.map((o) => ({
                    id: o.key,
                    name: o.label,
                    price: o.price,
                  })),
                  ...extras,
                ].map((item) => (
                  <div key={item.id}>
                    <dt>{item.name}</dt>
                    <dd>{planPrice(item.price)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        )}
      </div>
      {!isQuote && (
        <>
          <div className={styles.purchaseTotal}>
            <span>
              Your selected package<small>USD</small>
            </span>
            <output aria-label="Selected package total" aria-live="polite">
              {planPrice(total)}
            </output>
          </div>
          {exchangeRate && (
            <p className={styles.currencyNote}>
              Approximately KES{" "}
              {Math.round(total * exchangeRate).toLocaleString()}
            </p>
          )}
        </>
      )}
      <div className={styles.purchaseActions}>
        {isQuote ? (
          <Link href={customHref} className={styles.primaryButton}>
            Discuss this design <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        ) : (
          <>
            <button
              type="button"
              onClick={onBuy}
              disabled={adding || buying}
              className={styles.primaryButton}
            >
              {buying ? (
                <LoaderCircle
                  size={17}
                  className={styles.spin}
                  aria-hidden="true"
                />
              ) : (
                <ArrowUpRight size={17} aria-hidden="true" />
              )}
              {buying ? "Taking you to checkout…" : "Continue to checkout"}
            </button>
            <button
              type="button"
              onClick={onAdd}
              disabled={adding || buying}
              className={styles.secondaryButton}
            >
              {adding ? (
                <LoaderCircle
                  size={16}
                  className={styles.spin}
                  aria-hidden="true"
                />
              ) : (
                <ShoppingBag size={16} aria-hidden="true" />
              )}
              {adding ? "Adding your plan…" : "Add to cart"}
            </button>
            <p className={styles.deliveryNote}>
              <Download size={13} aria-hidden="true" /> Digital files, available
              after payment.
            </p>
          </>
        )}
      </div>
      <Link
        href={`/contact?${new URLSearchParams({ designId: design.id })}`}
        className={styles.purchaseHelp}
      >
        A little guidance?
        <span>
          Talk to an architect <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </Link>
    </aside>
  );
}
