"use client";

import { useState } from "react";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { GoldButton } from "@/components/ui/gold-button";
import { OutlineButton } from "@/components/ui/outline-button";
import { GoldDivider } from "@/components/ui/gold-divider";
import { tokens } from "@/lib/design-tokens";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";

/**
 * Theme Test Page — Dev-only page for validating design system tokens.
 *
 * This page renders every token, every button variant, every card type,
 * and every typography style side by side in both light and dark modes.
 *
 * Use this to catch regressions during development.
 *
 * 🗑️ Delete before production deploy.
 */
export default function ThemeTestPage() {
  const [activeTab, setActiveTab] = useState<
    "tokens" | "components" | "typography"
  >("tokens");

  const tokenCategories = [
    {
      title: "Core Colors",
      tokens: [
        { name: "--ink", value: tokens.ink, label: "Ink (Background)" },
        { name: "--surface", value: tokens.surface, label: "Surface" },
        { name: "--card", value: tokens.card, label: "Card" },
        { name: "--cream", value: tokens.cream, label: "Cream (Text)" },
        { name: "--cream-dim", value: tokens.creamDim, label: "Cream Dim" },
        { name: "--gold", value: tokens.gold, label: "Gold (Primary)" },
        { name: "--gold-light", value: tokens.goldLight, label: "Gold Light" },
        { name: "--muted", value: tokens.muted, label: "Muted" },
      ],
    },
    {
      title: "Border Colors",
      tokens: [
        { name: "--border-color", value: tokens.border, label: "Border" },
        {
          name: "--border-gold",
          value: tokens.borderGold,
          label: "Border Gold",
        },
      ],
    },
    {
      title: "Semantic Colors",
      tokens: [
        { name: "--background", value: tokens.background, label: "Background" },
        { name: "--foreground", value: tokens.foreground, label: "Foreground" },
        { name: "--primary", value: tokens.primary, label: "Primary" },
        { name: "--secondary", value: tokens.secondary, label: "Secondary" },
        { name: "--accent", value: tokens.accent, label: "Accent" },
        {
          name: "--destructive",
          value: tokens.destructive,
          label: "Destructive",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cb-border bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1
            className="text-2xl font-light"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            Theme Test <span className="text-gold">Page</span>
          </h1>
          <div className="text-sm text-cream-dim">Theme toggle removed.</div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-cb-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-8">
            {(["tokens", "components", "typography"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 py-4 text-sm uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? "border-gold text-gold"
                    : "border-transparent text-cream-dim hover:text-cream"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {activeTab === "tokens" && (
          <div className="space-y-12">
            <SectionHeading
              label="Design Tokens"
              title={
                <>
                  CSS <span className="text-gold">Variables</span>
                </>
              }
              description="All design tokens rendered with their current values. Verify both light and dark modes."
            />

            {tokenCategories.map((category) => (
              <section key={category.title}>
                <h3 className="mb-6 text-lg font-medium text-cream-dim">
                  {category.title}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {category.tokens.map((token) => (
                    <GlassCard key={token.name} className="p-4">
                      <div
                        className="mb-3 h-20 rounded-lg border border-cb-border"
                        style={{ background: token.value }}
                      />
                      <p className="text-sm font-medium text-cream">
                        {token.label}
                      </p>
                      <code className="mt-1 block text-xs text-cream-dim">
                        {token.name}
                      </code>
                    </GlassCard>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {activeTab === "components" && (
          <div className="space-y-12">
            <SectionHeading
              label="UI Components"
              title={
                <>
                  Component <span className="text-gold">Gallery</span>
                </>
              }
              description="All shared components rendered with current theme tokens."
            />

            {/* Custom Components */}
            <section>
              <h3 className="mb-6 text-lg font-medium text-cream-dim">
                Design System Components
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <GlassCard className="p-6">
                  <p className="mb-4 text-sm text-cream-dim">GlassCard</p>
                  <p className="text-cream">
                    Standard card with glassmorphism.
                  </p>
                </GlassCard>
                <GlassCard variant="hover" className="p-6">
                  <p className="mb-4 text-sm text-cream-dim">
                    GlassCard (Hover)
                  </p>
                  <p className="text-cream">Hover to see color transition.</p>
                </GlassCard>
                <GlassCard variant="featured" className="p-6">
                  <p className="mb-4 text-sm text-cream-dim">
                    GlassCard (Featured)
                  </p>
                  <p className="text-cream">Highlighted with shadow.</p>
                </GlassCard>
              </div>
            </section>

            <GoldDivider />

            {/* Buttons */}
            <section>
              <h3 className="mb-6 text-lg font-medium text-cream-dim">
                Buttons
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <GoldButton>Default</GoldButton>
                <GoldButton variant="small">Small</GoldButton>
                <GoldButton variant="large">Large</GoldButton>
                <OutlineButton>Outline</OutlineButton>
                <OutlineButton withArrow>With Arrow</OutlineButton>
                <Button variant="default">shadcn Default</Button>
                <Button variant="secondary">shadcn Secondary</Button>
                <Button variant="outline">shadcn Outline</Button>
                <Button variant="ghost">shadcn Ghost</Button>
                <Button variant="destructive">shadcn Destructive</Button>
              </div>
            </section>

            <GoldDivider />

            {/* Form Elements */}
            <section>
              <h3 className="mb-6 text-lg font-medium text-cream-dim">
                Form Elements
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-cream-dim">Input</label>
                  <Input placeholder="Type something..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-cream-dim">
                    Disabled Input
                  </label>
                  <Input disabled placeholder="Disabled..." />
                </div>
                {/* <div className="flex items-center gap-2">
                  <Checkbox id="test-checkbox" />
                  <label htmlFor="test-checkbox" className="text-sm text-cream">
                    Checkbox option
                  </label>
                </div> */}
              </div>
            </section>

            <GoldDivider />

            {/* Badges */}
            <section>
              <h3 className="mb-6 text-lg font-medium text-cream-dim">
                Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </section>

            <GoldDivider />

            {/* shadcn Cards */}
            <section>
              <h3 className="mb-6 text-lg font-medium text-cream-dim">
                shadcn Cards
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Standard Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-cream-dim">
                      Using shadcn Card component with theme tokens.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        )}

        {activeTab === "typography" && (
          <div className="space-y-12">
            <SectionHeading
              label="Typography"
              title={
                <>
                  Text <span className="text-gold">Styles</span>
                </>
              }
              description="All typography variants with current theme colors."
            />

            <div className="space-y-8">
              <div>
                <p className="mb-2 text-sm text-cream-dim">H1 - Display</p>
                <h1
                  className="text-[clamp(44px,9vw,130px)] font-light leading-[0.92] tracking-[-0.02em]"
                  style={{
                    fontFamily:
                      'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                  }}
                >
                  Your Dream. Our{" "}
                  <em className="text-gold not-italic">Blueprint.</em>
                </h1>
              </div>

              <GoldDivider />

              <div>
                <p className="mb-2 text-sm text-cream-dim">
                  H2 - Section Title
                </p>
                <h2
                  className="text-[clamp(36px,4.5vw,60px)] font-light leading-[1.1]"
                  style={{
                    fontFamily:
                      'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                  }}
                >
                  From Vision to <em className="text-gold">Reality</em>
                </h2>
              </div>

              <GoldDivider />

              <div>
                <p className="mb-2 text-sm text-cream-dim">H3 - Card Title</p>
                <h3
                  className="text-[26px]"
                  style={{
                    fontFamily:
                      'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                  }}
                >
                  Explore & Discover
                </h3>
              </div>

              <GoldDivider />

              <div>
                <p className="mb-2 text-sm text-cream-dim">Body Text</p>
                <p className="max-w-xl text-[15px] leading-[1.7] text-cream-dim">
                  We turn visions into liveable reality - exceptional
                  architectural designs and bespoke house plans, crafted for the
                  way you want to live.
                </p>
              </div>

              <GoldDivider />

              <div>
                <p className="mb-2 text-sm text-cream-dim">Small / Label</p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-gold">
                  Est. Kenya · Architecture & Design
                </p>
              </div>

              <GoldDivider />

              <div>
                <p className="mb-2 text-sm text-cream-dim">Muted Text</p>
                <p className="text-[13px] leading-[1.8] text-cb-muted">
                  Your trusted partner in architectural design across Kenya. We
                  turn blueprints into homes and homes into legacies.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cb-border bg-card px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm text-cb-muted">
            Theme Test Page — Delete before production deploy
          </p>
        </div>
      </footer>
    </div>
  );
}
