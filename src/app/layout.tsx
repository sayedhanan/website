// src/app/layout.tsx
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>  {/* avoids mismatch warnings :contentReference[oaicite:18]{index=18} */}
      <body className="min-h-screen bg-[--color-background] text-[--color-primary-text]">  {/* base-layer tokens :contentReference[oaicite:19]{index=19} */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

