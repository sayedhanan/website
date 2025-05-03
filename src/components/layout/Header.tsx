'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { RightNav } from '@/components/layout/RightNav';

export function Header() {
  return (
    <header className="w-full bg-[--color-surface] shadow-sm">
      <div
        className="
          mx-auto max-w-7xl px-4 py-3
          flex items-center justify-between
        "
      >
        {/* Left: Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-[--color-primary-text]"
        >
          Sayed Hanan
        </Link>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <Navbar />
        </div>

        {/* Right: Hamburger + RightNav */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Navbar /> {/* This will show only hamburger on mobile */}
          </div>

          {/* Divider + Theme + Socials */}
          <RightNav />
        </div>
      </div>
    </header>
  );
}
