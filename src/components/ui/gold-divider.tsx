import { cn } from "@/lib/utils";

/**
 * GoldDivider — Thin gold accent separator.
 * 
 * Part of the Concept Builders design system.
 * Used to visually separate sections with a subtle gold border.
 * 
 * ⚠️ Do not override border color. Use the `className` prop
 * for spacing adjustments only.
 * 
 * @example
 * ```tsx
 * <GoldDivider />
 * 
 * <GoldDivider className="my-12" />
 * 
 * <GoldDivider orientation="vertical" className="h-24" />
 * ```
 */
interface GoldDividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function GoldDivider({
  className,
  orientation = "horizontal",
}: GoldDividerProps) {
  return (
    <div
      className={cn(
        "border-border-gold",
        orientation === "horizontal" && "w-full border-t",
        orientation === "vertical" && "h-full border-l",
        className
      )}
    />
  );
}
