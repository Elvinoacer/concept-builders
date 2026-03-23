import { cn } from "@/lib/utils";

/**
 * SectionHeading — Consistent section heading with gold accent.
 * 
 * Part of the Concept Builders design system.
 * Uses Cormorant Garamond for display typography with a gold accent line.
 * 
 * ⚠️ Do not override font family or sizes inline. Use the `className` prop
 * for layout adjustments only.
 * 
 * @example
 * ```tsx
 * <SectionHeading
 *   label="The Process"
 *   title={<>From Vision to <em className="text-gold">Reality</em></>}
 * />
 * ```
 */
interface SectionHeadingProps {
  /** Small uppercase label above the title */
  label?: string;
  /** Main heading text - can include styled elements */
  title: React.ReactNode;
  /** Optional description text */
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      {label && (
        <p
          className={cn(
            "mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-gold",
            align === "center" && "justify-center"
          )}
        >
          {align !== "center" && <span className="h-px w-7 bg-gold" />}
          {label}
          {align === "center" && <span className="h-px w-7 bg-gold" />}
        </p>
      )}
      <h2
        className="text-[clamp(36px,4.5vw,60px)] font-light leading-[1.1]"
        style={{
          fontFamily:
            'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
        }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-[360px] text-[14px] leading-[1.8] text-cream-dim">
          {description}
        </p>
      )}
    </div>
  );
}
