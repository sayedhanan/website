// src/app/blog/[slug]/page.tsx
import { getPostBySlug, getPostSlugs } from '@/utils/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';

export const dynamic   = 'force-static';
export const revalidate = false;

// Pre-render all post slugs at build time
export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

interface PostPageProps {
  // Awaitable params object
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const { title, date, readingTime, abstract, content } = post;

  return (
    <article className="section-wrapper section-spacing prose lg:prose-xl dark:prose-invert">
      {/* 1. Post Title */}
      <h1 className="mb-4">{title}</h1>

      {/* 2. Meta: date & reading time */}
      <time
        dateTime={date}
        className="block mb-4 text-sm text-[var(--color-secondary-text)]"
      >
        {date} · {readingTime}
      </time>

      {/* 3. Abstract (optional) */}
      {abstract && (
        <p className="mb-6 text-lg text-[var(--color-secondary-text)]">
          {abstract}
        </p>
      )}

      {/* 4. MDX Content */}
      <div className="mdx-content">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}
