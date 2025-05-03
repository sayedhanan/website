'use client';

import { socialLinks } from '@/constants/social-links';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function RightNav() {
  return (
    <div className="flex items-center gap-4">
      {/* Vertical Divider */}
      <div className="h-5 w-px bg-gray-300" />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Social Links */}
      {socialLinks.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-[--color-primary-text] hover:text-gray-600 transition"
        >
          <Icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
}
