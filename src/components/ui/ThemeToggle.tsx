"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // During SSR or pre-mount, render a placeholder to avoid mismatches
    return <button aria-label="Toggle Dark Mode" className="p-2 rounded-full opacity-0" disabled />;
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={
        "p-2 rounded-full transition-colors bg-[var(--color-surface)] text-[var(--color-primary-text)] hover:bg-[var(--color-accent-hover)] hover:text-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      }
    >
      {resolvedTheme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
