import { cn } from "@/lib/utils";

/**
 * GlassCard — Recurring card pattern with glassmorphism effect.
 * 
 * Part of the Concept Builders design system.
 * Provides the standard card styling with backdrop blur and gold border accent.
 * 
 * ⚠️ Do not override background or border colors inline. Use the `variant` prop
 * or `className` for layout adjustments only.
 * 
 * @example
 * ```tsx
 * <GlassCard>
 *   <h3>Card Title</h3>
 *   <p>Card content...</p>
 * </GlassCard>
 * ```
 */
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "hover" | "featured";
}

export function GlassCard({
  children,
  className,
  variant = "default",
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border-gold rounded-xl",
        variant === "hover" && "transition-colors hover:bg-surface",
        variant === "featured" && "border-gold/50 shadow-lg shadow-gold/5",
        className
      )}
    >
      {children}
    </div>
  );
}
