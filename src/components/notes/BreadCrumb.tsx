// src/components/notes/Breadcrumb.tsx
import Link from 'next/link';
import { NoteNode } from '@/utils/notes-mdx';

interface BreadcrumbProps {
  items: NoteNode[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="w-full overflow-x-auto py-2 mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1">
        <li className="inline-flex items-center">
          <Link 
            href="/notes" 
            className="
              inline-block
              px-2 py-1
              text-sm font-medium
              transition-colors duration-150
              text-[var(--color-primary-text)] hover:text-[var(--color-accent)]
            "
          >
            Notes
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.path} className="inline-flex items-center">
            <span className="mx-2 text-[var(--color-secondary-text)]">/</span>
            {index === items.length - 1 ? (
              <span 
                className="
                  inline-block
                  px-2 py-1
                  text-sm font-medium
                  text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]
                " 
                aria-current="page"
              >
                {item.title}
              </span>
            ) : (
              <Link 
                href={item.path} 
                className="
                  inline-block
                  px-2 py-1
                  text-sm font-medium
                  transition-colors duration-150
                  text-[var(--color-primary-text)] hover:text-[var(--color-accent)]
                "
              >
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}