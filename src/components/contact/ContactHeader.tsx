import { contactHeader } from "@/lib/dummydata";
import SectionHeading from "@/components/ui-premium/section-heading";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const ContactHeader = () => {
  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.2em] mb-6"
      >
        <Mail className="w-3 h-3" />
        Get In Touch
      </motion.div>
      
      <SectionHeading
        title={contactHeader.title}
        subtitle={contactHeader.description}
        align="left"
        gradient
        level={1}
      />
    </div>
  );
};

export default ContactHeader;
