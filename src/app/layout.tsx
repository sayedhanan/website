'use client';

import './globals.css';
// import './imports.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize Prism.js on the client side after component mounts

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[--color-background] text-[--color-primary-text]">
        <ThemeProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

// Note: We've removed the metadata export since it's not compatible with 'use client'
// You'll need to add it to a separate file if you want to keep the metadata