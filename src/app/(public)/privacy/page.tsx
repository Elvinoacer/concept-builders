"use client";
import { privacy } from "@/lib/privacy-data";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Calendar, Eye, FileText, Mail, Download } from "lucide-react";
import { useState, useEffect } from "react";
import PageSection from "@/components/ui-premium/page-section";
import SectionHeading from "@/components/ui-premium/section-heading";
import GlassCard from "@/components/ui-premium/glass-card";
import GoldButton from "@/components/ui-premium/gold-button";
import OutlineButton from "@/components/ui-premium/outline-button";
import { cn } from "@/lib/utils";

const PrivacyPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
      },
    },
  };

  const itemVariants = {
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

  const headerVariants = {
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
            <Shield className="w-4 h-4" />
            Clearance & Privacy
          </motion.div>

          <SectionHeading
            title="Privacy Policy"
            subtitle="Your data integrity and sovereignty are our primary executive priorities."
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
              <span>Last updated: October 26, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{privacy.length} Privacy Protocols</span>
            </div>
          </motion.div>
        </div>

        {/* Quick Navigation */}
        <div className="mb-12 flex justify-center">
          <GlassCard className="p-4 inline-block" hover={false}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Eye className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-black text-gold uppercase tracking-widest mr-2 border-r border-gold/20 pr-4">
                Protocol Index
              </span>
              {privacy.map((section, index) => (
                <a
                  key={index}
                  href={`#section-${index}`}
                  className="px-3 py-1 text-[10px] font-black text-cream-dim hover:text-gold uppercase tracking-widest transition-colors duration-200"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Content Section */}
        <GlassCard className="p-8 sm:p-12 lg:p-16" hover={false}>
          {privacy.map((section, index) => (
            <motion.section
              key={index}
              id={`section-${index}`}
              className="mb-16 last:mb-0 scroll-mt-32"
            >
              {/* Section Header */}
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

              {/* Section Content */}
              <div className="prose prose-invert max-w-none ml-0 sm:ml-18
                              prose-p:text-cream-dim prose-p:text-lg prose-p:leading-relaxed
                              prose-strong:text-gold prose-strong:font-black
                              prose-ul:marker:text-gold
                              prose-a:text-gold hover:prose-a:text-white transition-colors">
                {section.content.split("\n\n").map((paragraph, pIndex) => (
                  <motion.div
                    key={pIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 last:mb-0"
                  >
                    {paragraph.includes("<") ? (
                      <div dangerouslySetInnerHTML={{ __html: paragraph }} />
                    ) : (
                      <p>{paragraph}</p>
                    )}
                  </motion.div>
                ))}
              </div>

              {index < privacy.length - 1 && (
                <div className="mt-16 pt-8 border-t border-cb-border/50" />
              )}
            </motion.section>
          ))}
        </GlassCard>

        {/* Footer Support */}
        <div className="mt-12">
          <GlassCard className="p-10 text-center" hover>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
              Data Sovereignty
            </h3>
            <p className="text-cream-dim mb-10 max-w-xl mx-auto font-medium leading-relaxed">
              For any executive inquiries regarding your data clearance, contact our privacy specialists immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GoldButton icon={<Shield className="w-5 h-5" />}>
                Privacy Console
              </GoldButton>
              <OutlineButton icon={<Download className="w-5 h-5" />}>
                Data Protocol
              </OutlineButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageSection>
  );
};

export default PrivacyPage;
