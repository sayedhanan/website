// src/app/blog/[slug]/page.tsx - Debugging Version
import { getPostBySlug, getPostSlugs } from '@/utils/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);


  return (
    <article className="section-wrapper section-spacing prose dark:prose-invert">
      <h1 className="mb-4">{post.title}</h1>
      <time dateTime={post.date} className="block mb-6 text-sm text-[var(--color-secondary-text)]">
        {post.date} · {post.readingTime}
      </time>
      
      
      {/* Actual MDX content */}
      <div className="mdx-content">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}