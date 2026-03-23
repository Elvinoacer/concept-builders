import { cn } from "@/lib/utils";

/**
 * GoldButton — Primary CTA button.
 * 
 * Part of the Concept Builders design system.
 * Gold background with ink text, hover state with shimmer effect.
 * 
 * ⚠️ Do not override background or text colors inline.
 * Use `variant` prop for style variants.
 * 
 * @example
 * ```tsx
 * <GoldButton>Browse House Plans</GoldButton>
 * 
 * <GoldButton variant="large">Get Started</GoldButton>
 * 
 * <GoldButton asChild>
 *   <Link href="/designs">View Plans</Link>
 * </GoldButton>
 * ```
 */
interface GoldButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "large" | "small";
  asChild?: boolean;
  onClick?: () => void;
  href?: string;
}

export function GoldButton({
  children,
  className,
  variant = "default",
  asChild,
  onClick,
  href,
}: GoldButtonProps) {
  const Comp = asChild ? "span" : href ? "a" : "button";
  
  const baseClasses = cn(
    "group relative overflow-hidden inline-flex items-center justify-center",
    "bg-gold text-ink font-medium uppercase tracking-[0.14em]",
    "transition-all duration-300",
    "hover:shadow-lg hover:shadow-gold/20",
    variant === "default" && "px-9 py-4 text-[13px]",
    variant === "large" && "px-12 py-5 text-[14px]",
    variant === "small" && "px-6 py-3 text-[12px]",
    className
  );

  const content = (
    <>
      <span className="absolute inset-0 -translate-x-full bg-gold-light transition-transform duration-300 group-hover:translate-x-0" />
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href && !asChild) {
    return (
      <a href={href} className={baseClasses} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <Comp className={baseClasses} onClick={onClick}>
      {content}
    </Comp>
  );
}
