"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { NavLink } from "@/components/ui/nav-link";
import { navLinks } from "@/constants/nav-links";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";


const MobileMenu = dynamic(() => import("./MobileMenu").then((mod) => mod.MobileMenu), {
  ssr: false,
});

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((o) => !o);
  const close  = () => setIsOpen(false);

  return (
    <nav role="navigation" aria-label="Main">
      {/* Desktop Links */}
      <ul className="hidden md:flex space-x-6">
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <NavLink href={href} label={label} />
          </li>
        ))}
      </ul>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button
          onClick={toggle}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className={cn(
            "focus:outline-none",
            "text-[var(--color-primary-text)] dark:text-[var(--color-primary-text)]"
          )}
        >
          <span className="sr-only">
            {isOpen ? "Close navigation menu" : "Open navigation menu"}
          </span>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isOpen} onLinkClick={close} />
    </nav>
  );
}