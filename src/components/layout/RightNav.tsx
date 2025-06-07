'use client';

import { socialLinks } from '@/constants/social-links';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function RightNav() {
  // Grab only the GitHub entry
  const githubLink = socialLinks.find((s) => s.label === 'GitHub');

  return (
    <div className="flex items-center gap-4">
      {/* Divider */}
      <div className="h-5 w-px bg-gray-300" />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* GitHub Only */}
      {githubLink && (
        <a
          href={githubLink.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={githubLink.label}
          className="text-[--color-primary-text] hover:text-gray-600 transition"
        >
          <githubLink.icon className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}
