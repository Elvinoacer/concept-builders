import CustomDesignForm from "@/components/custom-design/CustomDesignForm";
import CustomDesignHeader from "@/components/custom-design/CustomDesignHeader";
import {
  DraftingCompass,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from "lucide-react";

const CustomDesignPage = () => {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <section className="relative overflow-hidden border-b border-cb-border px-6 pb-10 pt-28 sm:px-10 lg:px-[60px] lg:pt-36">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_40%,rgba(200,137,42,0.08),transparent_65%),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(200,137,42,0.05),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45)_30%,rgba(0,0,0,0.45)_70%,transparent)]" />
        </div>

        <div className="relative mx-auto w-full max-w-screen-2xl">
          <p className="mb-5 flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] text-gold">
            <span className="h-px w-8 bg-gold" />
            Concept Builders · Bespoke Architecture
          </p>

          <h1
            className="text-[clamp(48px,9vw,132px)] font-light leading-[0.9] tracking-[-0.03em]"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            <span className="block">Custom</span>
            <span className="block text-gold">Design.</span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-[13px] leading-[1.9] text-cream-dim sm:text-[14px]"
            style={{ fontFamily: 'var(--font-outfit), "Outfit", sans-serif' }}
          >
            Tell us your vision and we will translate it into a complete
            architectural package tailored to your land, lifestyle, and budget.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-px border border-cb-border bg-cb-border md:grid-cols-4">
            {[
              {
                icon: Sparkles,
                title: "Tailored",
                caption: "Design from scratch",
              },
              {
                icon: DraftingCompass,
                title: "Complete",
                caption: "Plans + structural options",
              },
              {
                icon: TimerReset,
                title: "Fast",
                caption: "Prompt architect feedback",
              },
              {
                icon: ShieldCheck,
                title: "Reliable",
                caption: "Professional support",
              },
            ].map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className="bg-card px-4 py-5 sm:px-5"
              >
                <item.icon className="mb-2 h-4 w-4 text-gold" />
                <p
                  className="text-[20px] font-light leading-none text-cream"
                  style={{
                    fontFamily:
                      'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                  }}
                >
                  {item.title}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 sm:px-10 lg:px-[60px] lg:py-14">
        <div className="mx-auto w-full max-w-6xl overflow-hidden border border-cb-border bg-[linear-gradient(180deg,rgba(26,24,19,0.95),rgba(17,16,9,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
          <CustomDesignHeader />
          <div className="border-t border-cb-border px-4 py-6 sm:px-6 md:px-8 lg:px-10">
            <CustomDesignForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomDesignPage;
