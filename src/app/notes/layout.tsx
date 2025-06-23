import React from 'react';
import { organizeNotesTree } from '@/utils/notes-mdx';
import { NotesNav } from '@/components/notes/NotesNav';
import { metadata } from './metadata';

export { metadata };

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = organizeNotesTree();

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <aside className="w-full md:w-64 lg:w-72 border-r border-gray-200 dark:border-gray-800 md:h-screen md:sticky md:top-0 overflow-y-auto">
        <div className="p-4 h-full">
          <NotesNav tree={tree} />
        </div>
      </aside>
      <main className="flex-1 max-w-full overflow-x-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            {children}
          </article>
        </div>
      </main>
    </div>
  );
}
