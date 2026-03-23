"use client";

import ContactForm from "@/components/contact/ContactForm";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import dynamic from "next/dynamic";
import PageSection from "@/components/ui-premium/page-section";

const Location = dynamic(() => import("@/components/contact/Location"), {
  ssr: false,
  loading: () => (
    <div className="mt-12">
      <div className="h-8 bg-gold/10 rounded-xl animate-pulse mb-6 max-w-[200px]"></div>
      <div className="aspect-video w-full bg-gold/5 rounded-3xl animate-pulse border-2 border-dashed border-gold/10"></div>
    </div>
  ),
});

const ContactPage = () => {
  return (
    <PageSection variant="ink" className="pt-8 sm:pt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column - Context & Info */}
          <div className="lg:col-span-5 space-y-12">
            <ContactHeader />
            <ContactInfo />
            <div className="hidden lg:block">
              <Location />
            </div>
          </div>

          {/* Right Column - Execution (Form) */}
          <div className="lg:col-span-7">
            <ContactForm />
            <div className="lg:hidden mt-20">
              <Location />
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
};

export default ContactPage;
