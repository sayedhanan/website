// src/components/blog/CategoryNav.tsx
import React from 'react';
import Link from 'next/link';
import { blogCategories } from '@/constants/blog-categories';

export function CategoryNav() {
  return (
    <nav className="w-full">
      <ul className="flex flex-wrap justify-start gap-4">
        {blogCategories.map((cat) => (
          <li key={cat.href}>
            <Link
              href={cat.href}
              className="
                inline-block 
                px-3 py-1 
                rounded 
                text-base font-medium 
                text-on-accent 
                hover:bg-[var(--color-accent-hover)] 
                hover:text-on-accent
                transition
                duration-150
              "
            >
              {cat.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
