import React from 'react';
import NoteCard from '@/components/notes/NoteCard';
import { organizeNotesTree } from '@/utils/notes-mdx';
import { metadata } from './metadata';

export { metadata };

export default function NotesIndexPage() {
  const tree = organizeNotesTree();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[var(--color-primary-text)]">
        Documentation
      </h1>
      <p className="text-lg mb-8 text-[var(--color-secondary-text)]">
        Welcome to the documentation section. Browse topics below or use the navigation menu.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tree.map((node) => (
          <div key={node.path}>
            <NoteCard note={node} />
          </div>
        ))}
      </div>
    </div>
  );
}
