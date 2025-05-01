// src/app/blog/[slug]/page.tsx
import { getPostBySlug, getPostSlugs, type Post } from '@/utils/mdx';

export const dynamic   = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const { title, date, readingTime, abstract, content } =
    await getPostBySlug(slug);

  return (
    <article className="section-wrapper prose lg:prose-xl dark:prose-invert">
      <h1>{title}</h1>
      <time dateTime={date}>{date} · {readingTime}</time>
      {abstract && <p>{abstract}</p>}
      <div className="mdx-content">{content}</div>
    </article>
  );
}
