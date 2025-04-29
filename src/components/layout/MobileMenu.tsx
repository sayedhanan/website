// src/components/layout/MobileMenu.tsx
"use client";

import { navLinks } from "@/constants/nav-links";
import { NavLink } from "@/components/ui/nav-link";
import { motion, AnimatePresence } from "framer-motion";
import FocusTrap from "focus-trap-react";
import { cn } from "@/utils/cn";

interface MobileMenuProps {
  isOpen: boolean;
  onLinkClick: () => void;
}

export function MobileMenu({ isOpen, onLinkClick }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <FocusTrap
          active
          focusTrapOptions={{
            initialFocus: false,
            clickOutsideDeactivates: true,
          }}
        >
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            role="menu"
            aria-label="Mobile navigation"
            className={cn(
              "absolute top-16 inset-x-0",
              "bg-[var(--color-surface)]",
              "flex flex-col items-center space-y-6 py-6 shadow-md md:hidden z-50"
            )}
          >
            {navLinks.map(({ href, label }) => (
              <li key={href} onClick={onLinkClick}>
                <NavLink href={href} label={label} />
              </li>
            ))}
          </motion.ul>
        </FocusTrap>
      )}
    </AnimatePresence>
  );
}

