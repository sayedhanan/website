// File: src/app/blog/page.tsx

import { getAllCategories, getAllPosts, POSTS_PER_PAGE } from '@/utils/blog-mdx';
import { CategoryNav } from '@/components/blog/CategoryNav';
import BlogPostsList from '@/components/blog/BlogPostsList';
import { Suspense } from 'react';
import { metadata } from './metadata';

export { metadata };

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

// Generate static params for pagination
export async function generateStaticParams() {
  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

async function BlogContent({ searchParams }: BlogPageProps) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const allPosts = await getAllPosts();
  const categories = await getAllCategories();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return (
    <section className="section-wrapper section-spacing">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Thoughts, tutorials, and insights on development
        </p>
      </div>

      <CategoryNav categories={categories} />

      <BlogPostsList
        posts={allPosts}
        postsPerPage={POSTS_PER_PAGE}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/blog"
        showPostCount={true}
      />
    </section>
  );
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogContent searchParams={searchParams} />
    </Suspense>
  );
}
