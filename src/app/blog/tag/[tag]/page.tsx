// File: app/blog/tag/[tag]/page.tsx
export const dynamic = 'force-dynamic';

import { getAllTags, getPaginatedPostsByTag, getAllCategories } from '@/utils/blog-mdx';
import ArticleCard from '@/components/ui/article-card';
import { CategoryNav } from '@/components/blog/CategoryNav';
import Pagination from '@/components/blog/Pagination';
import { notFound } from 'next/navigation';

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  // ✏️ await both before use
  const { tag } = await params;
  const { page } = await searchParams;

  const decodedTag = decodeURIComponent(tag);
  const allTags = await getAllTags();
  const exactTag = allTags.find((t) => t.toLowerCase() === decodedTag.toLowerCase());
  if (!exactTag) notFound();

  const currentPage = page ? parseInt(page, 10) : 1;
  const { posts, totalPages } = await getPaginatedPostsByTag(exactTag, currentPage);
  const categories = await getAllCategories();

  return (
    <section className="section-wrapper section-spacing">
      <h1 className="text-3xl font-bold mb-6">Tag: #{exactTag}</h1>

      <CategoryNav categories={categories} />

      {posts.length > 0 ? (
        <>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                title={post.title}
                excerpt={post.abstract}
                date={post.date}
                readingTime={post.readingTime}
                categories={post.categories}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            tagPath={tag}
          />
        </>
      ) : (
        <p className="mt-8">No posts found with this tag.</p>
      )}
    </section>
  );
}
