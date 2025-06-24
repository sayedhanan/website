// File: app/blog/tag/[tag]/page.tsx (Updated)
import { getAllTags, getPostsByTag, getAllCategories, POSTS_PER_PAGE } from '@/utils/blog-mdx';
import { CategoryNav } from '@/components/blog/CategoryNav';
import BlogPostsList from '@/components/blog/BlogPostsList';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: tag.toLowerCase(),
  }));
}

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function TagContent({ params, searchParams }: TagPageProps) {
  const { tag } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const decodedTag = decodeURIComponent(tag);
  
  const allTags = await getAllTags();
  const exactTag = allTags.find(
    (t) => t.toLowerCase() === decodedTag.toLowerCase()
  );
  
  if (!exactTag) {
    notFound();
  }
  
  const posts = await getPostsByTag(exactTag);
  const categories = await getAllCategories();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  
  return (
    <section className="section-wrapper section-spacing">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tag: #{exactTag}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} with this tag
        </p>
      </div>
      
      <CategoryNav categories={categories} />
      
      <BlogPostsList
        posts={posts}
        postsPerPage={POSTS_PER_PAGE}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/tag/${tag}`}
        showPostCount={true}
      />
    </section>
  );
}

export default function TagPage({ params, searchParams }: TagPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TagContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}