// File: src/app/blog/[slug]/page.tsx

import { getPostBySlug, getPostSlugs } from '@/utils/blog-mdx';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = await Promise.resolve(params);

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { title, date, readingTime, abstract, content } = post;

  return (
    <section className="section-wrapper section-spacing">
      {/*
        Responsive layout:
        - Single column on small screens with centered article
        - Three columns on lg+ (25% | 50% | 25%)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 justify-items-center lg:justify-items-start">

        {/* Left aside (hidden on small, 25% on lg) */}
        <aside className="hidden lg:block lg:col-span-3">
          {/* TODO: insert TableOfContents here */}
        </aside>

        {/* Main article (centered on small) */}
        <article className="col-span-1 lg:col-span-6 mx-auto lg:mx-0 prose lg:prose-xl dark:prose-invert">
          <h1 className="mt-0">{title}</h1>
          <time className="block text-sm text-secondary mb-4" dateTime={date}>
            {date} &middot; {readingTime} min read
          </time>
          {abstract && <p className="lead mb-6">{abstract}</p>}
          <div className="mdx-content">{content}</div>
        </article>

        {/* Right aside (hidden on small, 25% on lg) */}
        <aside className="hidden lg:block lg:col-span-3">
          {/* TODO: insert RelatedPosts or other component here */}
        </aside>

      </div>
    </section>
  );
}