'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  return (
    <header className="w-full bg-[--color-surface] shadow-sm">
      <div
        className="
        mx-auto max-w-7xl px-4 py-3
        flex items-center justify-between
      "
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-[--color-primary-text]"
        >
          Sayed Hanan
        </Link>

        {/* Navigation */}
        <div className="flex-1 flex justify-end md:justify-center">
          <Navbar />
        </div>

        {/* Theme Toggle */}
        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
