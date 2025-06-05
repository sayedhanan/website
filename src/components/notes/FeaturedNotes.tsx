'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NoteCard from './NoteCard';
import type { NoteNode } from '@/utils/notes-mdx';

interface FeaturedNotesProps {
  notes: NoteNode[];
  title?: string;
  description?: string;
}

export default function FeaturedNotes({
  notes,
  title = 'Featured Documentation',
  description = 'Explore our latest documentation and resources',
}: FeaturedNotesProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount: number =
      direction === 'left'
        ? -carouselRef.current.offsetWidth
        : carouselRef.current.offsetWidth;

    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!notes || notes.length === 0) return null;

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary-text)]">
            {title}
          </h2>
          <p className="text-[var(--color-secondary-text)]">{description}</p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="
              p-2
              rounded-full
              bg-[var(--color-background)]
              hover:bg-[var(--color-border)]
              dark:bg-[var(--color-surface)]
              dark:hover:bg-[var(--color-border)]
              transition-colors
            "
          >
            <ChevronLeft className="w-5 h-5 text-[var(--color-primary-text)]" />
          </button>

          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="
              p-2
              rounded-full
              bg-[var(--color-background)]
              hover:bg-[var(--color-border)]
              dark:bg-[var(--color-surface)]
              dark:hover:bg-[var(--color-border)]
              transition-colors
            "
          >
            <ChevronRight className="w-5 h-5 text-[var(--color-primary-text)]" />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="
          flex space-x-4
          overflow-x-auto
          pb-4
          scrollbar-hide snap-x
        "
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {notes.map((note) => (
          <div key={note.path} className="min-w-[300px] max-w-[350px] snap-start">
            <NoteCard note={note} />
          </div>
        ))}
      </div>

      <div className="mt-4 text-right">
        <Link
          href="/notes"
          className="
            text-[var(--color-accent)]
            hover:text-[var(--color-accent-hover)]
            hover:underline
            font-medium
            inline-flex items-center justify-end
          "
        >
          View all documentation
          <ChevronRight className="ml-1 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
