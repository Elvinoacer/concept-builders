"use client";

import ContactForm from "@/components/contact/ContactForm";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import dynamic from "next/dynamic";

const Location = dynamic(() => import("@/components/contact/Location"), {
  ssr: false,
  loading: () => (
    <div className="mt-6 xs:mt-8 sm:mt-10 md:mt-12">
      <div className="h-8 xs:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-3 xs:mb-4 max-w-48"></div>
      <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    </div>
  ),
});

const ContactPage = () => {
  return (
    <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-4 xs:py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="container mx-auto max-w-6xl px-3 xs:px-4 sm:px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
          {/* Left Column - Contact Info */}
          <div className="lg:w-2/5 xl:w-2/5 order-2 lg:order-1">
            <div className="space-y-6 xs:space-y-8 sm:space-y-10">
              <ContactHeader />
              <ContactInfo />
              <Location />
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:w-3/5 xl:w-3/5 order-1 lg:order-2 mb-8 xs:mb-10 sm:mb-12 lg:mb-0">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
