import { cn } from "@/lib/utils";

/**
 * PageSection — Standard section wrapper component.
 * 
 * Part of the Concept Builders design system.
 * Provides consistent max-width, padding, and responsive behavior.
 * 
 * ⚠️ Do not override padding or max-width inline. Use the `className` prop
 * for additional styling only.
 * 
 * @example
 * ```tsx
 * <PageSection>
 *   <SectionHeading label="The Process" title="From Vision to Reality" />
 *   {/* Content */}
 * </PageSection>
 * ```
 */
interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function PageSection({ children, className, id }: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "max-w-7xl mx-auto px-6 md:px-12 py-20",
        className
      )}
    >
      {children}
    </section>
  );
}
