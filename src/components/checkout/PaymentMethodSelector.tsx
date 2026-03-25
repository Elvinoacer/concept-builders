"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type PaymentMethodSelectorProps = {
  selectedMethod: string;
  onSelect: (method: string) => void;
  paypalConfigured?: boolean;
  paypalMode?: "sandbox" | "live";
};

const paymentMethods = [
  {
    id: "paypal",
    name: "PayPal / Card",
    image: "/payments/paypal.png",
    description: "Pay with PayPal, Visa, Mastercard, or Amex",
    supportedCurrencies: ["USD", "EUR", "GBP"],
    processingTime: "Instant",
  },
  {
    id: "mpesa",
    name: "M-Pesa",
    image: "/payments/mpesa.png",
    description: "Pay with your M-Pesa account",
    supportedCurrencies: ["KES"],
    processingTime: "Instant",
  },
];

const PaymentMethodSelector = ({
  selectedMethod,
  onSelect,
  paypalConfigured = true,
  paypalMode = "sandbox",
}: PaymentMethodSelectorProps) => {
  return (
    <div>
      {/* Header */}
      <div className="text-center xs:text-left mb-4 xs:mb-6">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-light text-cream mb-2 leading-tight">
          Select Payment Method
        </h2>
        <p className="font-mono text-xs xs:text-sm uppercase tracking-[0.12em] text-cream-dim">
          Pick one method, then complete payment below
        </p>
      </div>

      {!paypalConfigured && (
        <div className="mb-4 border border-[rgba(200,137,42,0.35)] bg-[rgba(200,137,42,0.08)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-gold">
          PayPal is currently unavailable. Use M-Pesa.
        </div>
      )}

      {paypalConfigured && (
        <div className="mb-4 inline-flex border border-cb-border bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-dim">
          PayPal mode: <span className="ml-1 text-gold">{paypalMode}</span>
        </div>
      )}

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 gap-3 xs:gap-4">
        {paymentMethods.map((method) =>
          (() => {
            const isUnavailable = !paypalConfigured && method.id === "paypal";

            return (
              <motion.div
                key={method.id}
                onClick={() => {
                  if (!isUnavailable) onSelect(method.id);
                }}
                className={`flex items-start xs:items-center gap-3 xs:gap-4 p-3 xs:p-4 border cursor-pointer transition-all duration-200 group ${
                  selectedMethod === method.id
                    ? "border-gold bg-[rgba(200,137,42,0.08)]"
                    : isUnavailable
                      ? "border-cb-border bg-surface/50 opacity-60"
                      : "border-cb-border bg-surface hover:border-[rgba(200,137,42,0.35)]"
                }`}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
              >
                {/* Payment Method Image */}
                <div className="relative w-10 h-7 xs:w-12 xs:h-8 sm:w-14 sm:h-10 flex items-center justify-center overflow-hidden border border-cb-border bg-card p-1 flex-shrink-0">
                  <Image
                    src={method.image}
                    alt={method.name}
                    fill
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                    sizes="(max-width: 480px) 40px, (max-width: 640px) 48px, 56px"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2 mb-1 xs:mb-2">
                    <h3 className="text-base xs:text-lg font-semibold text-cream truncate">
                      {method.name}
                    </h3>
                    {selectedMethod === method.id && (
                      <div className="hidden xs:flex items-center gap-1 text-gold text-xs font-medium">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Selected
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-cream-dim">
                    <span
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                        selectedMethod === method.id
                          ? "border-gold"
                          : "border-cb-border"
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <span className="h-2 w-2 rounded-full bg-gold" />
                      )}
                    </span>
                    <span>
                      {selectedMethod === method.id
                        ? "Currently selected"
                        : "Tap to select"}
                    </span>
                  </div>

                  <p className="mb-2 text-xs leading-relaxed text-cream-dim xs:mb-3 xs:text-sm">
                    {method.description}
                  </p>

                  {isUnavailable && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold">
                      Requires PayPal configuration
                    </p>
                  )}

                  {/* Additional Info - Hidden on mobile, visible on xs+ */}
                  <div className="hidden xs:flex flex-wrap items-center gap-3 text-xs text-cream-dim">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span>{method.supportedCurrencies.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{method.processingTime}</span>
                    </div>
                  </div>

                  {/* Mobile-only additional info */}
                  <div className="xs:hidden flex items-center justify-between text-xs text-cream-dim mt-2">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      {method.supportedCurrencies.length} currencies
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {method.processingTime}
                    </span>
                  </div>
                </div>

                {/* Selection Indicator - Mobile */}
                {selectedMethod === method.id && (
                  <div className="xs:hidden w-5 h-5 rounded-full bg-gold flex items-center justify-center text-ink flex-shrink-0">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Selection Indicator - Desktop */}
                {selectedMethod === method.id && (
                  <div className="hidden xs:flex w-6 h-6 rounded-full bg-gold items-center justify-center text-ink flex-shrink-0">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Hover Arrow - Desktop only */}
                <div
                  className={`hidden xs:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    selectedMethod === method.id
                      ? "text-gold"
                      : "text-cream-dim"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.div>
            );
          })(),
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-4 xs:mt-6 pt-4 xs:pt-5 border-t border-cb-border">
        <div className="flex items-center justify-center gap-2 text-xs xs:text-sm text-cream-dim">
          <svg
            className="w-4 h-4 xs:w-5 xs:h-5 text-green-500 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>All payments are secure and encrypted with 256-bit SSL</span>
        </div>
      </div>

      {/* Mobile Help Text */}
      <div className="xs:hidden mt-4 border border-cb-border bg-surface p-3">
        <p className="text-xs text-cream-dim text-center">
          💡 Tap on a payment method to select it
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
