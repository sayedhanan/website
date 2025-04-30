// src/components/theme/ThemeProvider.tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"             // → toggles class="dark" on <html> :contentReference[oaicite:0]{index=0}
      defaultTheme="system"         // → fallback to OS preference :contentReference[oaicite:1]{index=1}
      enableSystem                  // → respond to OS-level changes :contentReference[oaicite:2]{index=2}
      disableTransitionOnChange     // → prevent flash-of-unstyled-content :contentReference[oaicite:3]{index=3}
    >
      {children}
    </NextThemesProvider>
  );
}
