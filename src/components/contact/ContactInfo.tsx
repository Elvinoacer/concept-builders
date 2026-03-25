import { contactInfo } from "@/lib/dummydata";
import GlassCard from "@/components/ui-premium/glass-card";
import { Mail, Phone, MessageSquare, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  chat: MessageSquare,
  phone_in_talk: Phone,
  mail: Mail,
  location_on: MapPin,
};

const ContactInfo = () => {
  return (
    <div className="space-y-6">
      {contactInfo.map((item, index) => {
        const Icon = iconMap[item.icon] || MessageSquare;

        return (
          <GlassCard
            key={index}
            className="p-6 transition-all duration-500 group"
            hover
          >
            <div className="flex items-start gap-6">
              {/* Icon Container */}
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gold border border-gold/50 text-ink shadow-xl shadow-gold/20 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-black text-gold uppercase tracking-[0.2em] mb-2">
                  {item.title}
                </h3>

                {item.title === "Live Chat" ? (
                  <a
                    href="https://wa.me/254741360865"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-black text-white hover:text-gold transition-colors duration-300 break-words tracking-tight"
                  >
                    {item.value}
                  </a>
                ) : item.title === "Phone" ? (
                  <a
                    href="tel:254741360865"
                    className="text-xl font-black text-white hover:text-gold transition-colors duration-300 tracking-tight"
                  >
                    {item.value}
                  </a>
                ) : item.title === "Email" ? (
                  <a
                    href="mailto:support@conceptbuilders.co.ke"
                    className="text-xl font-black text-white hover:text-gold transition-colors duration-300 break-words tracking-tight"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-xl font-black text-white leading-tight tracking-tight">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};

export default ContactInfo;
