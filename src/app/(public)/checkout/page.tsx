"use client";

import IntasendPayment from "@/components/checkout/IntasendPayment";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import PaypalPayment from "@/components/checkout/PaypalPayment";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

type PayPalRuntimeConfig = {
  configured: boolean;
  mode: "sandbox" | "live";
  clientId: string;
};

const CheckoutPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const {
    cart,
    loading: isLoading,
    cartTotal,
    appliedDiscountAmount,
    appliedDiscountId,
    appliedDiscountCode,
    setAppliedDiscount,
  } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [paypalConfig, setPaypalConfig] = useState<PayPalRuntimeConfig | null>(
    null,
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth?callbackUrl=%2Fcheckout");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (isLoading) return;
    if (cart.length > 0) return;

    toast.info("Your cart is empty. Add a plan before checkout.");
    router.replace("/cart");
  }, [cart.length, isLoading, router, status]);

  useEffect(() => {
    let mounted = true;

    const fetchPayPalConfig = async () => {
      try {
        const response = await fetch("/api/paypal/config", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as PayPalRuntimeConfig;
        if (!mounted) return;
        setPaypalConfig(data);

        if (!data.configured && paymentMethod === "paypal") {
          setPaymentMethod("mpesa");
          toast.info(
            "PayPal is not configured. Switched to M-Pesa for checkout.",
          );
        }
      } catch {
        // Ignore and keep current UI state
      }
    };

    void fetchPayPalConfig();

    return () => {
      mounted = false;
    };
  }, [paymentMethod]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-ink text-cream flex items-center justify-center px-6">
        <p className="text-sm sm:text-base text-cream-dim">
          Preparing secure checkout...
        </p>
      </div>
    );
  }

  const finalTotal = cartTotal - appliedDiscountAmount;

  const renderPaymentMethod = () => {
    switch (paymentMethod) {
      case "paypal":
        return (
          <PaypalPayment
            cart={cart}
            finalTotal={finalTotal}
            appliedDiscountAmount={appliedDiscountAmount}
            appliedDiscountId={appliedDiscountId}
            appliedDiscountCode={appliedDiscountCode}
            paypalConfigured={Boolean(paypalConfig?.configured)}
            paypalMode={paypalConfig?.mode || "sandbox"}
          />
        );
      case "mpesa":
        return (
          <IntasendPayment
            cart={cart}
            finalTotal={finalTotal}
            appliedDiscountAmount={appliedDiscountAmount}
            appliedDiscountId={appliedDiscountId}
            appliedDiscountCode={appliedDiscountCode}
            paymentMethod={paymentMethod}
          />
        );
      default:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-cream-dim"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <p className="text-cream-dim text-sm sm:text-base">
              Please select a payment method to continue
            </p>
          </div>
        );
    }
  };

  const selectedMethodLabel =
    paymentMethod === "mpesa" ? "M-Pesa" : "PayPal / Card";

  return (
    <div className="min-h-screen bg-ink text-cream">
      <div className="mx-auto w-full max-w-screen-2xl px-5 py-8 sm:px-8 lg:px-[60px]">
        {/* Header */}
        <header className="text-center mb-8">
          <h1
            className="text-3xl sm:text-4xl font-light text-cream leading-tight"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            Secure Checkout
          </h1>
          <div className="flex items-center justify-center gap-2 text-gold font-medium mt-3 text-sm sm:text-base">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Your payment information is secure and encrypted</span>
          </div>
        </header>

        {/* Progress Indicators - Hidden on mobile, visible on larger screens */}
        <div className="hidden sm:flex justify-center mb-8">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold text-ink rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="font-medium text-cream">Cart</span>
            </div>
            <div className="w-12 h-0.5 bg-gold"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold text-ink rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="font-medium text-cream">Checkout</span>
            </div>
            <div className="w-12 h-0.5 bg-cb-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-surface text-cream-dim rounded-full flex items-center justify-center text-sm font-medium border border-cb-border">
                3
              </div>
              <span className="text-cream-dim">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="sm:hidden mb-6">
          <div className="flex items-center justify-between text-xs text-cream-dim mb-2">
            <span>Step 2 of 3</span>
            <span>Checkout</span>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div className="bg-gold h-2 rounded-full w-2/3"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Order Summary - Comes first on mobile for better UX */}
          <div className="lg:w-1/2 xl:w-2/5 2xl:w-2/5 order-2 lg:order-1">
            <div className="border border-cb-border bg-card p-5 sm:p-6">
              <OrderSummary
                items={cart}
                isLoading={isLoading}
                onDiscountApplied={(amount, id, code) =>
                  setAppliedDiscount(amount, id, code)
                }
                cartTotal={cartTotal}
                appliedDiscountAmount={appliedDiscountAmount}
              />
            </div>

            {/* Trust Indicators - Mobile Only */}
            <div className="sm:hidden mt-6">
              <div className="border border-cb-border bg-surface p-4">
                <h3 className="font-medium text-cream text-sm mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure & Protected
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-cream-dim">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span>Money Back</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span>Instant Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:w-1/2 xl:w-3/5 2xl:w-3/5 order-1 lg:order-2">
            <div className="border border-cb-border bg-card p-5 sm:p-6">
              {/* Payment Method Selector */}
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelect={setPaymentMethod}
                paypalConfigured={Boolean(paypalConfig?.configured)}
                paypalMode={paypalConfig?.mode || "sandbox"}
              />

              <div className="mt-6 border border-cb-border bg-surface p-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream-dim">
                  Quick Checkout
                </p>
                <p className="mt-1 text-sm text-cream">
                  Selected method:{" "}
                  <span className="text-gold">{selectedMethodLabel}</span>
                </p>
              </div>

              <div className="mt-6">
                {paypalConfig?.configured && paypalConfig.clientId ? (
                  <PayPalScriptProvider
                    options={{
                      clientId: paypalConfig.clientId,
                      currency: "USD",
                      intent: "capture",
                      components: "buttons",
                      enableFunding: ["card", "paylater"],
                      disableFunding: ["venmo"],
                    }}
                  >
                    {renderPaymentMethod()}
                  </PayPalScriptProvider>
                ) : (
                  renderPaymentMethod()
                )}
              </div>
            </div>

            {/* Additional Trust Indicators - Desktop Only */}
            <div className="hidden sm:block mt-6">
              <div className="border border-cb-border bg-surface p-5">
                <h3 className="font-medium text-cream text-sm mb-3">
                  Why shop with us?
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-cream-dim">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center mb-1">
                      <svg
                        className="w-4 h-4 text-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center mb-1">
                      <svg
                        className="w-4 h-4 text-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <span>Money Back</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center mb-1">
                      <svg
                        className="w-4 h-4 text-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center mb-1">
                      <svg
                        className="w-4 h-4 text-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <span>Instant Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Footer Assistance */}
        <div className="sm:hidden mt-8">
          <div className="border border-[rgba(200,137,42,0.35)] bg-[rgba(200,137,42,0.08)] p-4">
            <h4 className="font-medium text-gold text-sm mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Need Help?
            </h4>
            <p className="text-cream-dim text-xs mb-3">
              Our support team is here to help you complete your purchase.
            </p>
            <div className="flex gap-2">
              <a
                href="tel:+254700000000"
                className="flex-1 bg-gold hover:bg-gold-light text-ink text-xs font-medium py-2 px-3 rounded-lg text-center transition-colors"
              >
                Call Support
              </a>
              <a
                href="mailto:support@conceptbuilders.com"
                className="flex-1 bg-transparent hover:bg-gold/10 text-gold text-xs font-medium py-2 px-3 rounded-lg border border-gold text-center transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
