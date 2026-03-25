"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

type PublicThemeToggleProps = {
  className?: string;
  autoDark?: boolean;
};

const AUTO_DARK_SESSION_KEY = "cb-auto-dark-applied";

export default function PublicThemeToggle({
  className,
  autoDark = true,
}: PublicThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !autoDark) return;
    if (typeof window === "undefined") return;

    const alreadyApplied =
      sessionStorage.getItem(AUTO_DARK_SESSION_KEY) === "1";
    if (alreadyApplied) return;

    sessionStorage.setItem(AUTO_DARK_SESSION_KEY, "1");

    if (resolvedTheme === "light") {
      setTheme("dark");
      toast("Switched to dark mode for better readability.", {
        description: "You can still switch back anytime from the theme button.",
      });
    }
  }, [autoDark, mounted, resolvedTheme, setTheme]);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`grid h-10 w-10 place-items-center border border-cb-border bg-card/70 text-cream-dim ${className || ""}`}
      >
        <Moon size={15} />
      </button>
    );
  }

  const isLight = resolvedTheme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label="Toggle theme"
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className={`group grid h-10 w-10 place-items-center border border-cb-border bg-card/70 text-cream-dim transition-colors hover:border-gold hover:text-gold ${className || ""}`}
    >
      {isLight ? (
        <Moon
          size={15}
          className="transition-transform duration-200 group-hover:scale-110"
        />
      ) : (
        <Sun
          size={15}
          className="transition-transform duration-200 group-hover:scale-110"
        />
      )}
    </button>
  );
}
