// File: src/app/notes/page.tsx

import React from 'react';
import { getPostSlugs, getPostBySlug, type Post } from '@/utils/notes-mdx'; // Adjust based on your utils location
import ArticleCard from '@/components/ui/article-card'; // Assuming you have this component

export const dynamic = 'force-static';
export const revalidate = false;

export default async function NotesPage() {
  // Get all post slugs and metadata
  const slugs = getPostSlugs(); // Correct usage in this file
  const notesData = await Promise.all(
    slugs.map((slug) => getPostBySlug(slug))
  );

  // Extract metadata for all notes
  const allNotes: Omit<Post, 'content'>[] = notesData.map(({ content, ...meta }) => meta);

  return (
    <>
      <section className="section-wrapper section-spacing">
        <h1 className="text-4xl font-semibold mb-6">All Notes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allNotes.map((note) => (
            <ArticleCard
              key={note.slug}
              href={`/notes/${note.slug}`}
              title={note.title}
              excerpt={note.abstract}
              date={note.date}
              readingTime={note.readingTime}
            />
          ))}
        </div>
      </section>
    </>
  );
}
