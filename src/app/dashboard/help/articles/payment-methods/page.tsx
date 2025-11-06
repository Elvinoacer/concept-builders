"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const PaymentMethodsPage = () => {
  const router = useRouter();

  const cards = [
    {
      id: "accessing-options",
      icon: "shopping_cart",
      title: "Accessing Payment Options",
      content: [
        "When you're ready to purchase your chosen designs, proceed to the secure checkout page.",
        "After reviewing your order summary, you'll find the 'Select Payment Method' section.",
      ],
      delay: 0.1,
    },
    {
      id: "choosing-method",
      icon: "credit_card",
      title: "Choosing Your Payment Method",
      content: [
        "On the checkout page, you can select from our supported payment gateways:",
        "**PayPal:** A widely recognized and secure online payment system. Select PayPal to be redirected to their platform to complete your transaction.",
        "**Intasend:** Our integrated payment solution for various local and international payment options. Select Intasend to proceed with card payments or other local methods.",
      ],
      delay: 0.2,
    },
    {
      id: "completing-purchase",
      icon: "check_circle",
      title: "Completing Your Purchase",
      content: [
        "After selecting your preferred payment method:",
        "Click the 'Proceed to Payment' button.",
        "You will be securely redirected to the chosen payment gateway (PayPal or Intasend) to finalize your transaction.",
        "Follow the on-screen instructions to enter your payment details.",
      ],
      delay: 0.3,
    },
    {
      id: "post-purchase",
      icon: "download",
      title: "Post-Purchase Confirmation",
      content: [
        "Upon successful completion of your purchase, you will be redirected back to your Concept Builders dashboard.",
        "From there, you can access and download all your purchased design files.",
      ],
      delay: 0.4,
    },
    {
      id: "security",
      icon: "security",
      title: "Security and Privacy",
      content: [
        "Your payment security is our top priority. All transactions are encrypted and processed through trusted third-party payment gateways.",
        "Concept Builders does not store your sensitive payment card details on our servers.",
      ],
      delay: 0.5,
      fullWidth: true,
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Fluid Container with Progressive Padding */}
      <div className="w-full px-4 min-[375px]:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-40">
        {/* Content Container with Optimal Reading Width */}
        <div className="w-full max-w-[1200px] mx-auto py-4 sm:py-6 md:py-8">
          {/* Header Section */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-8 sm:mb-12 md:mb-16"
          >
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
                {/* Fluid Typography Scale */}
                <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.02em] sm:tracking-[-0.033em] bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text break-words">
                  Payment Methods: Your Options at Checkout
                </h1>
                {/* Responsive Body Text */}
                <p className="text-subtle-light dark:text-subtle-dark text-base sm:text-lg lg:text-xl font-normal leading-relaxed sm:leading-normal max-w-[800px]">
                  Concept Builders offers secure and convenient payment options
                  to complete your design purchases. This guide explains how to
                  select and use your preferred payment method during the
                  checkout process.
                </p>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="w-full mb-12 sm:mb-16">
            <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: card.delay }}
                    className={`bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-2xl p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 ${
                      card.fullWidth ? "sm:col-span-2 xl:col-span-3" : ""
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                          {card.icon}
                        </span>
                      </div>
                      <h3 className="text-text-light dark:text-text-dark text-lg sm:text-xl font-bold leading-tight flex-1 min-w-0">
                        {card.title}
                      </h3>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1">
                      <ul className="space-y-2 sm:space-y-3">
                        {card.content.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base leading-relaxed flex items-start gap-2"
                          >
                            <span className="text-primary mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span className="flex-1 min-w-0">
                              {item.startsWith("**") ? (
                                <>
                                  <strong>
                                    {item.replace(/\*\*(.*?)\*\*/, "$1")}
                                  </strong>
                                  {item.includes(":") && item.split(":")[1]}
                                </>
                              ) : (
                                item
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Call to Action Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center gap-4 sm:gap-6"
              >
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                    payments
                  </span>
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <h2 className="text-text-light dark:text-text-dark text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em]">
                    Ready to make a purchase?
                  </h2>
                  <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base font-normal leading-relaxed sm:leading-normal max-w-xl mx-auto px-4">
                    Explore our designs and proceed to checkout to experience
                    our secure payment process.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/designs")}
                  className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition-all hover:opacity-90 min-w-[160px] sm:min-w-[180px]"
                >
                  Browse Designs
                  <span className="material-symbols-outlined text-lg sm:text-xl">
                    arrow_forward
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </main>

          {/* Footer */}
          <footer className="text-center text-subtle-light dark:text-subtle-dark text-xs sm:text-sm py-4 sm:py-6 border-t border-border-light dark:border-border-dark">
            <p>
              © {new Date().getFullYear()} Concept Builders. All Rights
              Reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
