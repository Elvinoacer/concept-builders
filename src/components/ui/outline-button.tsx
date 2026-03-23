import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * OutlineButton — Secondary CTA button with outline style.
 * 
 * Part of the Concept Builders design system.
 * Transparent background with gold border and cream text.
 * 
 * ⚠️ Do not override border or text colors inline.
 * Use the `className` prop for layout adjustments only.
 * 
 * @example
 * ```tsx
 * <OutlineButton>Custom Design</OutlineButton>
 * 
 * <OutlineButton href="/contact">Contact Us</OutlineButton>
 * 
 * <OutlineButton withArrow>Learn More</OutlineButton>
 * ```
 */
interface OutlineButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  withArrow?: boolean;
}

export function OutlineButton({
  children,
  className,
  href,
  onClick,
  withArrow = false,
}: OutlineButtonProps) {
  const baseClasses = cn(
    "group inline-flex items-center justify-center gap-2.5",
    "border border-gold px-6 py-2.5",
    "text-[12px] uppercase tracking-[0.16em] text-gold",
    "transition-all duration-300",
    "hover:bg-gold hover:text-ink",
    className
  );

  const content = (
    <>
      {children}
      {withArrow && (
        <svg
          className="transition-transform duration-300 group-hover:translate-x-1.5"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button className={baseClasses} onClick={onClick}>
      {content}
    </button>
  );
}
