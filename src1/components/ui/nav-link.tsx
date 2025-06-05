"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { cva } from "class-variance-authority";

// Define light/dark variants using your CSS variables
const navLink = cva("transition-colors", {
  variants: {
    theme: {
      light: "text-[var(--color-primary-text)] hover:text-[var(--color-accent)]",
      dark:  "text-[var(--color-primary-text)] hover:text-[var(--color-accent)]",
    },
  },
  defaultVariants: {
    theme: "light",
  },
});

type NavLinkProps = {
  href: string;
  label: string;
};

export function NavLink({ href, label }: NavLinkProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Link
      href={href}
      className={navLink({ theme: resolvedTheme === "dark" ? "dark" : "light" })}
    >
      {label}
    </Link>
  );
}
