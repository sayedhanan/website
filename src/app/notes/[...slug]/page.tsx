import React from 'react';
import { notFound } from 'next/navigation';
import { getNoteBySlug, findNoteInTree, organizeNotesTree } from '@/utils/notes-mdx';
import type { Metadata } from 'next';

interface NotePageProps {
  params: {
    slug: string[];
  };
}

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  // Safely access params
  const slug = params?.slug || [];
  const note = await getNoteBySlug(slug);
  
  if (!note) {
    return {
      title: 'Note Not Found',
    };
  }

  return {
    title: `${note.frontmatter.title} | Notes`,
    description: note.frontmatter.description || `Documentation for ${note.frontmatter.title}`,
  };
}

export default async function NotePage({ params }: { params: { slug: string[] } }) {
  // Safely access params
  const slug = params?.slug || [];
  const note = await getNoteBySlug(slug);
  
  if (!note) {
    return notFound();
  }

  const { content, frontmatter } = note;
  const tree = organizeNotesTree();
  const currentNote = findNoteInTree(tree, slug);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{frontmatter.title}</h1>
        {frontmatter.description && (
          <p className="text-xl text-gray-600 dark:text-gray-400">{frontmatter.description}</p>
        )}
      </div>

      <div className="mdx-content">
        {content}
      </div>

      {/* Optional: Add navigation between articles */}
      {currentNote && currentNote.children.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Next Topics</h3>
          <ul className="space-y-2">
            {currentNote.children.map(child => (
              <li key={child.path}>
                <a href={child.path} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {child.title}
                </a>
                {child.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{child.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}