// src/app/layout.tsx
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { metadata } from '@/constants/metadata';

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
