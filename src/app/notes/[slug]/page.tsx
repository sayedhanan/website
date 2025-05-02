import React from 'react';
import { getPostBySlug } from '@/utils/notes-mdx'; // Ensure this path matches your utils
import { notFound } from 'next/navigation';

interface Params {
  slug: string;
}

export default async function NotePage({ params }: { params: Params }) {
  const { slug } = params;

  // Fetch the note based on the slug
  let note;
  try {
    note = await getPostBySlug(slug);
  } catch {
    notFound(); // If note not found, trigger 404 page
  }

  const { title, date, readingTime, abstract, content } = note;

  return (
    <section className="section-wrapper section-spacing">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 justify-items-center lg:justify-items-start">
        {/* Left Sidebar - Can be used for navigation in future */}
        <aside className="hidden lg:block lg:col-span-2">
          {/* Placeholder for future navigation or other content */}
        </aside>

        {/* Main Content Area - Center */}
        <article className="col-span-1 lg:col-span-8 mx-auto lg:mx-0 prose lg:prose-xl dark:prose-invert">
          <h1 className="mt-0">{title}</h1>
          <time className="block text-sm text-secondary mb-4" dateTime={date}>
            {date} &middot; {readingTime} min read
          </time>
          {abstract && <p className="lead mb-6">{abstract}</p>}
          <div className="mdx-content">{content}</div>
        </article>

        {/* Right Sidebar - Placeholder for TOC/Ads */}
        <aside className="hidden lg:block lg:col-span-2">
          {/* Placeholder for Table of Contents (TOC) or ads in future */}
        </aside>
      </div>
    </section>
  );
}
