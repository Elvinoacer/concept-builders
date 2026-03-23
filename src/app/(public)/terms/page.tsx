"use client";
import { terms } from "@/lib/terms-data";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  FileText, Calendar, Scale, ArrowLeft, Download, 
  Mail, Shield, CheckCircle2, AlertTriangle 
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import PageSection from "@/components/ui-premium/page-section";
import SectionHeading from "@/components/ui-premium/section-heading";
import GlassCard from "@/components/ui-premium/glass-card";
import GoldButton from "@/components/ui-premium/gold-button";
import OutlineButton from "@/components/ui-premium/outline-button";
import { cn } from "@/lib/utils";

const TermsPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [hasAccepted, setHasAccepted] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Update active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user has previously accepted terms
  useEffect(() => {
    const accepted = localStorage.getItem("terms_accepted");
    setHasAccepted(accepted === "true");
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem("terms_accepted", "true");
    setHasAccepted(true);
    // You could trigger an analytics event or API call here
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: isMobile ? 10 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const scrollToSection = (index: number) => {
    const section = document.getElementById(`section-${index}`);
    if (section) {
      const offset = 80; // Account for sticky header
      const sectionTop = section.offsetTop - offset;

      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });
    }
  };

  const formatContent = (content: string) => {
    // Split content into paragraphs and add proper formatting
    return content.split("\n\n").map((paragraph, pIndex) => (
      <motion.p
        key={pIndex}
        className="text-base leading-relaxed text-cream-dim mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 * pIndex }}
      >
        {paragraph}
      </motion.p>
    ));
  };

  return (
    <PageSection variant="ink" className="pt-8 sm:pt-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 sm:mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <Scale className="w-4 h-4" />
            Legal Framework
          </motion.div>

          <SectionHeading
            title="Terms of Service"
            subtitle="Please review our operational guidelines and legal agreements carefully."
            align="center"
            gradient
            level={1}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-black text-gold/60 uppercase tracking-widest"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                Updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{terms.length} Governance Articles</span>
            </div>
          </motion.div>
        </div>

        {/* Important Notice */}
        {!hasAccepted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <GlassCard className="p-6 border-gold/30 bg-gold/5" hover={false}>
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-gold flex-shrink-0" />
                <div>
                  <h3 className="text-gold font-black uppercase tracking-tight mb-2">
                    Critical Agreement
                  </h3>
                  <p className="text-cream text-sm leading-relaxed font-medium">
                    By engaging with Concept Builders, you enter into a binding legal contract. 
                    Ensure full comprehension of these articles before proceeding.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Quick Nav - Desktop */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-32">
              <GlassCard className="p-8" hover={false}>
                <h3 className="text-sm font-black text-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <FileText className="w-4 h-4" />
                  Index
                </h3>
                <nav className="space-y-3">
                  {terms.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(index)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-2",
                        activeSection === index
                          ? "bg-gold/10 text-gold border-gold/30"
                          : "text-cream-dim border-transparent hover:border-cb-border hover:text-white"
                      )}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>

                {!hasAccepted && (
                  <GoldButton
                    onClick={handleAcceptTerms}
                    className="w-full mt-10"
                    icon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Accept
                  </GoldButton>
                )}
              </GlassCard>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-12">
            <GlassCard className="p-8 sm:p-12 lg:p-16" hover={false}>
              {/* Introduction */}
              <section className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gold" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Article I: introduction
                  </h2>
                </div>
                <div className="prose prose-invert max-w-none prose-p:text-cream prose-p:text-lg prose-p:leading-relaxed">
                  <p>
                    These Terms of Service govern your relationship with Concept Builders. 
                    Your use of this site confirms your unconditional acceptance of these protocols.
                  </p>
                </div>
              </section>

              {/* Sections */}
              <div className="space-y-16">
                {terms.map((section, index) => (
                  <section
                    key={index}
                    id={`section-${index}`}
                    className="scroll-mt-32"
                  >
                    <div className="flex items-start gap-6 mb-8 group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gold border border-gold/50 flex items-center justify-center shadow-xl shadow-gold/10 group-hover:scale-110 transition-transform">
                        <span className="text-ink font-black text-base italic">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-gold transition-colors duration-500">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none ml-0 sm:ml-18
                                    prose-p:text-cream-dim prose-p:text-lg prose-p:leading-relaxed
                                    prose-strong:text-gold prose-strong:font-black
                                    prose-ul:marker:text-gold">
                      {formatContent(section.content)}
                    </div>

                    {index < terms.length - 1 && (
                      <div className="mt-16 pt-8 border-t border-cb-border/50" />
                    )}
                  </section>
                ))}
              </div>

              {/* Final Acceptance */}
              {!hasAccepted && (
                <div className="mt-20 p-8 rounded-3xl bg-gold/5 border-2 border-dashed border-gold/20 text-center">
                  <h3 className="text-xl font-black text-gold uppercase tracking-widest mb-4">
                    Acknowledgement
                  </h3>
                  <p className="text-cream font-medium mb-8 max-w-md mx-auto leading-relaxed">
                    Accessing our premium services requires your formal agreement to these articles.
                  </p>
                  <GoldButton
                    onClick={handleAcceptTerms}
                    className="mx-auto"
                    icon={<CheckCircle2 className="w-5 h-5" />}
                  >
                    Sign Agreement
                  </GoldButton>
                </div>
              )}

              {/* Success State */}
              <AnimatePresence>
                {hasAccepted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-12 p-8 rounded-3xl bg-emerald-500/5 border-2 border-emerald-500/20 text-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-emerald-400 uppercase tracking-widest mb-2">
                      Governance Accepted
                    </h3>
                    <p className="text-emerald-400/70 font-medium">
                      Your clearance has been updated. Access granted.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            {/* Contact Footer */}
            <div className="mt-12">
              <GlassCard className="p-10 text-center" hover>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                  Legal Inquiry
                </h3>
                <p className="text-cream-dim mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                  Direct any specific queries regarding these protocols to our specialist console of legal advisors.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <GoldButton icon={<Mail className="w-5 h-5" />}>
                    Legal Consultant
                  </GoldButton>
                  <OutlineButton icon={<Download className="w-5 h-5" />}>
                    Protocol PDF
                  </OutlineButton>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
};

export default TermsPage;
