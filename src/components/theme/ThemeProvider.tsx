// src/components/theme/ThemeProvider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      attribute="class"          // toggle “dark” class on <html>
      defaultTheme="system"      // respect user’s system preference
      enableSystem               // update on system changes
      disableTransitionOnChange  // avoid flash when theme switches
    >
      {children}
    </NextThemesProvider>
  );
}
