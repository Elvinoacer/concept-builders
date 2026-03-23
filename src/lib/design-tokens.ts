/**
 * Design Tokens for Concept Builders
 * 
 * A single source-of-truth TypeScript export of all token names,
 * for use in JavaScript contexts (e.g. chart colors, canvas, dynamic styles).
 * 
 * This prevents string literal drift when referencing tokens in
 * Recharts, canvas, or framer-motion.
 */

export const tokens = {
  ink: "var(--ink)",
  surface: "var(--surface)",
  card: "var(--card)",
  cream: "var(--cream)",
  creamDim: "var(--cream-dim)",
  gold: "var(--gold)",
  goldLight: "var(--gold-light)",
  muted: "var(--muted)",
  border: "var(--border-color)",
  borderGold: "var(--border-gold)",
  background: "var(--background)",
  foreground: "var(--foreground)",
  primary: "var(--primary)",
  primaryForeground: "var(--primary-foreground)",
  secondary: "var(--secondary)",
  secondaryForeground: "var(--secondary-foreground)",
  mutedBg: "var(--muted-bg)",
  mutedForeground: "var(--muted-foreground)",
  accent: "var(--accent)",
  accentForeground: "var(--accent-foreground)",
  destructive: "var(--destructive)",
  destructiveForeground: "var(--destructive-foreground)",
  ring: "var(--ring)",
  radius: "var(--radius)",
  // Chart colors
  chart1: "var(--chart-1)",
  chart2: "var(--chart-2)",
  chart3: "var(--chart-3)",
  chart4: "var(--chart-4)",
  chart5: "var(--chart-5)",
} as const;

export type TokenKey = keyof typeof tokens;
