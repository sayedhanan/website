import { getPostBySlug, getPostSlugs } from '@/utils/mdx'
import { notFound } from 'next/navigation'


export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = await Promise.resolve(params); // 👈 fix: ensure `params` is awaited

  try {
    const { title, date, readingTime, abstract, content } = await getPostBySlug(slug);

    return (
      <article className="section-wrapper prose lg:prose-xl dark:prose-invert">
        <h1>{title}</h1>
        <time dateTime={date}>{date} · {readingTime}</time>
        {abstract && <p className="lead">{abstract}</p>}
        <div className="mdx-content">{content}</div>
      </article>
    );
  } catch {
    notFound();
  }
}
