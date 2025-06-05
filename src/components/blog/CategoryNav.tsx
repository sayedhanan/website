// src/components/blog/CategoryNav.tsx
'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type CategoryNavProps = {
  categories: string[];
};

export function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname();

  // Helper to determine if a given href is the current path
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="w-full overflow-x-auto py-2">
      <ul className="flex flex-wrap justify-start gap-3">
        <li>
          <Link
            href="/blog"
            className={`
              inline-block
              px-2 py-1
              text-sm font-medium
              transition-colors duration-150
              ${
                isActive('/blog')
                  ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                  : 'text-[var(--color-primary-text)] dark:text-[var(--color-primary-text)] hover:text-[var(--color-accent)]'
              }
            `}
          >
            All
          </Link>
        </li>
        {categories.map((category) => {
          const href = `/blog/category/${category.toLowerCase()}`;
          return (
            <li key={category}>
              <Link
                href={href}
                className={`
                  inline-block
                  px-2 py-1
                  text-sm font-medium
                  transition-colors duration-150
                  ${
                    isActive(href)
                      ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                      : 'text-[var(--color-primary-text)] dark:text-[var(--color-primary-text)] hover:text-[var(--color-accent)]'
                  }
                `}
              >
                {category}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
