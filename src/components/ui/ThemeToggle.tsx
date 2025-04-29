// src/components/ui/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      className="
        p-2 rounded-full transition-colors
        bg-[var(--color-surface)] text-[var(--color-primary-text)]
        hover:bg-[var(--color-accent-hover)] hover:text-[var(--color-surface)]
        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]
      "
    >
      {resolvedTheme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
