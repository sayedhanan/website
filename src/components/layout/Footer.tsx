"use client";

import Link from "next/link";
import { navLinks } from "@/constants/nav-links";

export function Footer() {
  return (
    <footer className="w-full bg-[--color-surface] py-6">
      <div className="
        mx-auto max-w-7xl px-4
        flex flex-col items-center
        text-sm text-[--color-primary-text]
        space-y-4
      ">
        {/* Footer Navigation */}
        <nav className="
          flex flex-col space-y-2
          md:flex-row md:space-x-4 md:space-y-0
        ">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[--color-primary-text] hover:text-[--color-accent]"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Privacy link - smaller, muted */}
        <div className="text-xs text-[--color-secondary-text]">
          <Link
            href="/privacy-policy"
            className="hover:text-[--color-accent] underline"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Copyright */}
        <div>
          © {new Date().getFullYear()} Sayed Hanan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
