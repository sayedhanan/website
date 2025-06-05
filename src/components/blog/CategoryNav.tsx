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
  
  return (
    <nav className="w-full overflow-x-auto py-2">
      <ul className="flex flex-wrap justify-start gap-4">
        <li>
          <Link
            href="/blog"
            className={`
              inline-block 
              px-3 py-1 
              rounded 
              text-base font-medium 
              transition
              duration-150
              ${pathname === '/blog' 
                ? 'bg-[var(--color-accent)] text-on-accent' 
                : 'hover:bg-[var(--color-accent-hover)] hover:text-on-accent'}
            `}
          >
            All
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <Link
              href={`/blog/category/${category.toLowerCase()}`}
              className={`
                inline-block 
                px-3 py-1 
                rounded 
                text-base font-medium 
                transition
                duration-150
                ${pathname === `/blog/category/${category.toLowerCase()}` 
                  ? 'bg-[var(--color-accent)] text-on-accent' 
                  : 'hover:bg-[var(--color-accent-hover)] hover:text-on-accent'}
              `}
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}