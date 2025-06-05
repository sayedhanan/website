// src/components/notes/Breadcrumb.tsx
import Link from 'next/link';
import { NoteNode } from '@/utils/notes-mdx';

interface BreadcrumbProps {
  items: NoteNode[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="mb-6 text-sm" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1">
        <li className="inline-flex items-center">
          <Link href="/notes" className="text-gray-500 hover:text-blue-600">
            Notes
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.path} className="inline-flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            {index === items.length - 1 ? (
              <span className="text-gray-700 font-medium" aria-current="page">
                {item.title}
              </span>
            ) : (
              <Link href={item.path} className="text-gray-500 hover:text-blue-600">
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}