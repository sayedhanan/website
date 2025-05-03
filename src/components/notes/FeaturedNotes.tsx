'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { NoteNode } from '@/utils/notes-mdx';

// Using your existing ArticleCard component structure
const NoteCard = ({ note }: { note: NoteNode }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-2">
        <Link href={note.path} className="text-blue-600 dark:text-blue-400 hover:underline">
          {note.title}
        </Link>
      </h3>
      {note.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{note.description}</p>
      )}
      {note.children.length > 0 && (
        <div className="mt-auto pt-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Related topics:</p>
          <ul className="space-y-1">
            {note.children.slice(0, 2).map((child) => (
              <li key={child.path} className="text-sm">
                <Link href={child.path} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {child.title}
                </Link>
              </li>
            ))}
            {note.children.length > 2 && (
              <li className="text-sm">
                <Link href={note.path} className="text-gray-500 dark:text-gray-400 hover:underline">
                  +{note.children.length - 2} more...
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

interface FeaturedNotesProps {
  notes: NoteNode[];
  title?: string;
  description?: string;
}

export default function FeaturedNotes({
  notes,
  title = "Featured Documentation",
  description = "Explore our latest documentation and resources"
}: FeaturedNotesProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' 
        ? -carouselRef.current.offsetWidth
        : carouselRef.current.offsetWidth;
      
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // If there are no notes, don't render anything
  if (!notes || notes.length === 0) return null;

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {notes.map((note) => (
          <div 
            key={note.path} 
            className="min-w-[300px] max-w-[350px] snap-start"
          >
            <NoteCard note={note} />
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-right">
        <Link 
          href="/notes" 
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center justify-end"
        >
          View all documentation
          <ChevronRight className="ml-1 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}