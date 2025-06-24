// src/app/notes/[...slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import {
  getNoteBySlug,
  findNoteInTree,
  organizeNotesTree,
  findNodePath,
  getAllNoteSlugs,
  type NoteNode,
} from '@/utils/notes-mdx';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/notes/BreadCrumb';

interface NotePageProps {
  params: Promise<{ slug: string[] }>;
}

// Generate static params for SSG
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  try {
    const allSlugs = getAllNoteSlugs();
    return allSlugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  try {
    // Await params before using
    const { slug } = await params;
    const note = await getNoteBySlug(slug || []);
    
    if (!note) {
      return {
        title: 'Note Not Found',
        description: 'The requested note could not be found.',
      };
    }

    return {
      title: `${note.frontmatter.title} | Notes`,
      description:
        note.frontmatter.description ||
        `Documentation for ${note.frontmatter.title}`,
      openGraph: {
        title: `${note.frontmatter.title} | Notes`,
        description:
          note.frontmatter.description ||
          `Documentation for ${note.frontmatter.title}`,
        type: 'article',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Note Not Found',
      description: 'The requested note could not be found.',
    };
  }
}

export default async function NotePage({ params }: NotePageProps) {
  try {
    // Await params before using
    const { slug } = await params;
    const note = await getNoteBySlug(slug || []);

    if (!note) {
      return notFound();
    }

    const { content, frontmatter } = note;
    const tree = organizeNotesTree();
    const currentNote = findNoteInTree(tree, slug);

    // Build breadcrumb items using the imported findNodePath helper
    const breadcrumbItems: NoteNode[] = [];
    if (currentNote) {
      const fullPath = findNodePath(currentNote, tree);
      if (fullPath) {
        breadcrumbItems.push(...fullPath);
      }
    }

    return (
      <>
        {/* Breadcrumb navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page header */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold mb-2" 
            style={{ color: 'var(--color-primary-text)' }}
          >
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p
              className="text-xl"
              style={{ color: 'var(--color-secondary-text)' }}
            >
              {frontmatter.description}
            </p>
          )}
        </div>

        {/* MDX Content */}
        <div className="mdx-content">{content}</div>

        {/* Next Topics (children) */}
        {currentNote && currentNote.children.length > 0 && (
          <div
            className="mt-12 pt-6"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--color-primary-text)' }}
            >
              Next Topics
            </h3>
            <ul className="space-y-2">
              {currentNote.children.map((child) => (
                <li key={child.path}>
                  <a
                    href={child.path}
                    className="hover:underline"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {child.title}
                  </a>
                  {child.description && (
                    <p
                      className="text-sm"
                      style={{ color: 'var(--color-secondary-text)' }}
                    >
                      {child.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error('Error rendering note page:', error);
    return notFound();
  }
}