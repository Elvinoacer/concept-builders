"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export interface DesignModalPlan {
  id?: string;
  name: string;
  style: string;
  beds: number | string;
  baths: number | string;
  sqft: string;
  img: string;
  basePrice?: number;
  hasFiles?: boolean;
  features?: string[];
}

interface DesignModalProps {
  plan: DesignModalPlan | null;
  onClose: () => void;
}

export default function DesignModal({ plan, onClose }: DesignModalProps) {
  const router = useRouter();

  const buildCustomDesignUrl = (params: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") query.set(key, String(value));
    });
    if (plan?.img) query.set("image", plan.img);
    return `/custom-design?${query.toString()}`;
  };

  useEffect(() => {
    if (!plan) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [plan, onClose]);

  if (!plan) return null;

  const handleGetPlanFiles = () => {
    if (plan.id && plan.hasFiles) {
      router.push(`/designs/${plan.id}`);
    } else if (plan.id) {
      router.push(buildCustomDesignUrl({ inspired_by: plan.id }));
    } else {
      router.push(buildCustomDesignUrl({ style: plan.style }));
    }
    onClose();
  };

  const handleRequestSimilar = () => {
    if (plan.id) {
      router.push(buildCustomDesignUrl({ inspired_by: plan.id, style: plan.style }));
    } else {
      router.push(buildCustomDesignUrl({ style: plan.style, beds: plan.beds }));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/75 px-4 pb-8 pt-24 backdrop-blur-sm" onClick={(event) => event.target === event.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className="relative grid w-full max-w-5xl overflow-visible border border-[rgba(240,232,216,0.14)] bg-[#141414] text-[#FDFCFA] shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        <button type="button" onClick={onClose} className="fixed right-6 top-24 z-20 grid h-10 w-10 place-items-center border border-white/15 bg-black/35 text-2xl text-white transition-colors hover:border-[#B8935A] hover:text-[#B8935A]" aria-label="Close design details">×</button>

        <div className="relative min-h-[320px] overflow-hidden md:min-h-[560px]">
          <img src={plan.img} alt={plan.name} className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/85 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 border border-[#B8935A]/40 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#B8935A]">{plan.style}</span>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="mb-4 w-fit border border-[#B8935A]/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#B8935A]">{plan.style}</p>
          <h3 className="font-serif text-4xl font-light leading-tight text-[#FDFCFA] sm:text-5xl">{plan.name}</h3>

          <div className="my-8 grid grid-cols-3 gap-3">
            {[{ label: "Beds", value: plan.beds }, { label: "Baths", value: plan.baths }, { label: "Area", value: plan.sqft }].map((stat) => (
              <div key={stat.label} className="border border-white/10 bg-white/[0.03] p-4 text-center">
                <div className="text-xl font-light text-white">{stat.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/38">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="border-y border-white/10 py-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Price</p>
            <p className="mt-1 text-3xl font-light text-white">{plan.basePrice ? `from $${plan.basePrice.toLocaleString()}` : "Custom quote"}</p>
          </div>

          {plan.features && plan.features.length > 0 && (
            <ul className="mt-6 grid gap-2 text-sm leading-relaxed text-white/65 sm:grid-cols-2">
              {plan.features.slice(0, 4).map((feature) => (
                <li key={feature} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 bg-[#B8935A]" />{feature}</li>
              ))}
            </ul>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={handleGetPlanFiles} className="border border-[#B8935A] bg-[#B8935A] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#141414] transition-colors hover:bg-transparent hover:text-[#B8935A]">Get Plan Files</button>
            <button type="button" onClick={handleRequestSimilar} className="border border-white/16 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-[#B8935A] hover:text-[#B8935A]">Request Similar Design</button>
          </div>
        </div>
      </div>
    </div>
  );
}
