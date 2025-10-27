'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PaymentMethodsPage = () => {
  const router = useRouter();

  const handleGoToBillingClick = () => {
    router.push('/dashboard/settings/billing'); // Assuming this is the path to billing settings
  };

  const sections = [
    {
      id: 'add-method',
      icon: 'credit_card',
      title: 'Adding a New Payment Method',
      content: [
        'Navigate to your "Account Settings" and select "Payment Methods."',
        'Click on "Add New Payment Method."',
        'Choose your preferred payment type (e.g., Credit/Debit Card, PayPal).',
        'Enter the required details securely.',
        'Confirm and save your new payment method.',
      ],
    },
    {
      id: 'manage-methods',
      icon: 'settings',
      title: 'Managing Existing Payment Methods',
      content: [
        'Set as Default: Choose a primary payment method for faster checkouts.',
        'Update Details: Modify card expiry dates or billing addresses.',
        'Remove Method: Securely delete a payment method you no longer wish to use.',
      ],
    },
    {
      id: 'supported-gateways',
      icon: 'payments',
      title: 'Supported Payment Gateways',
      content: [
        'Credit/Debit Cards: Visa, MasterCard, American Express, etc.',
        'PayPal: For quick and secure online transactions.',
        'Mobile Money (e.g., M-Pesa): Available in select regions for convenient mobile payments.',
      ],
    },
    {
      id: 'security-privacy',
      icon: 'security',
      title: 'Security and Privacy',
      content: [
        'Your payment information is encrypted and handled with the highest security standards.',
        'We do not store sensitive card details on our servers.',
      ],
    },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <main className="mt-8">
              <div className="flex flex-col gap-12">
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <div className="flex min-w-72 flex-col gap-3">
                    <p className="text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">Payment Methods: Your Options at Checkout</p>
                    <p className="text-subtle-light dark:text-subtle-dark text-lg font-normal leading-normal">
                      Concept Builders offers secure and convenient payment options to complete your design purchases. This guide explains how to select and use your preferred payment method during the checkout process.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                          shopping_cart
                        </span>
                      </div>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Accessing Payment Options</h3>
                    </div>
                    <ul className="list-disc pl-5 text-subtle-light dark:text-subtle-dark text-base leading-relaxed space-y-2">
                      <li>When you're ready to purchase your chosen designs, proceed to the secure checkout page.</li>
                      <li>After reviewing your order summary, you'll find the "Select Payment Method" section.</li>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                          credit_card
                        </span>
                      </div>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Choosing Your Payment Method</h3>
                    </div>
                    <ul className="list-disc pl-5 text-subtle-light dark:text-subtle-dark text-base leading-relaxed space-y-2">
                      <li>On the checkout page, you can select from our supported payment gateways:</li>
                      <ul className="list-circle pl-5 mt-2 space-y-1">
                        <li>**PayPal:** A widely recognized and secure online payment system. Select PayPal to be redirected to their platform to complete your transaction.</li>
                        <li>**Intasend:** Our integrated payment solution for various local and international payment options. Select Intasend to proceed with card payments or other local methods.</li>
                      </ul>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                          check_circle
                        </span>
                      </div>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Completing Your Purchase</h3>
                    </div>
                    <ul className="list-disc pl-5 text-subtle-light dark:text-subtle-dark text-base leading-relaxed space-y-2">
                      <li>After selecting your preferred payment method:</li>
                      <ul className="list-circle pl-5 mt-2 space-y-1">
                        <li>Click the "Proceed to Payment" button.</li>
                        <li>You will be securely redirected to the chosen payment gateway (PayPal or Intasend) to finalize your transaction.</li>
                        <li>Follow the on-screen instructions to enter your payment details.</li>
                      </ul>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                          download
                        </span>
                      </div>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Post-Purchase Confirmation</h3>
                    </div>
                    <ul className="list-disc pl-5 text-subtle-light dark:text-subtle-dark text-base leading-relaxed space-y-2">
                      <li>Upon successful completion of your purchase, you will be redirected back to your Concept Builders dashboard.</li>
                      <li>From there, you can access and download all your purchased design files.</li>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-6 flex flex-col gap-4 md:col-span-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                          security
                        </span>
                      </div>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Security and Privacy</h3>
                    </div>
                    <ul className="list-disc pl-5 text-subtle-light dark:text-subtle-dark text-base leading-relaxed space-y-2">
                      <li>Your payment security is our top priority. All transactions are encrypted and processed through trusted third-party payment gateways.</li>
                      <li>Concept Builders does not store your sensitive payment card details on our servers.</li>
                    </ul>
                  </motion.div>
                </div>

                <div className="text-center bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-8 flex flex-col items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                    <span className="material-symbols-outlined text-4xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">payments</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">Ready to make a purchase?</h2>
                    <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal max-w-xl mx-auto">
                      Explore our designs and proceed to checkout to experience our secure payment process.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/designs')} // Assuming /designs is the main design listing page
                    className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3 text-base font-semibold text-white transition-all hover:opacity-90"
                  >
                    Browse Designs
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </main>
            <footer className="mt-12 text-center text-subtle-light dark:text-subtle-dark text-sm py-4">
              <p>© {new Date().getFullYear()} Concept Builders. All Rights Reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
