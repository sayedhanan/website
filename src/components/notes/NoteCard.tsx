'use client';

import Link from 'next/link';
import type { NoteNode } from '@/utils/notes-mdx';

export interface NoteCardProps {
  note: NoteNode;
  /** Optional date string (e.g. “2025-06-01”) */
  date?: string;
  /** Optional reading time (e.g. “5 min read”) */
  readingTime?: string;
  /** If you ever want to tag notes with categories, pass them here */
  categories?: string[];
}

export default function NoteCard({
  note,
  date = '',
  readingTime = '',
  categories = [],
}: NoteCardProps) {
  return (
    <article className="card">
      {/* Category badges (if any) */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/notes/category/${category.toLowerCase()}`}
              className="
                text-xs font-medium
                px-2 py-1 rounded-full
                bg-[var(--color-border)]
                hover:bg-[var(--color-surface)]
                dark:bg-[var(--color-surface)]
                dark:hover:bg-[var(--color-border)]
                transition-colors
                text-[var(--color-primary-text)]
                no-underline
              "
            >
              {category}
            </Link>
          ))}
        </div>
      )}

      {/* Title / Link: no underline by default, underline on hover */}
      <h3 className="card-title">
        <Link href={note.path} className="no-underline hover:underline">
          {note.title}
        </Link>
      </h3>

      {/* Excerpt / Description */}
      {note.description && <p className="card-excerpt">{note.description}</p>}

      {/* Meta (date & reading time) */}
      <div className="card-meta">
        {date ? <time dateTime={date}>{date}</time> : null}
        {readingTime ? <span>{readingTime}</span> : null}
      </div>
    </article>
  );
}
