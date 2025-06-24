// File: app/blog/category/[category]/page.tsx (Updated)
import { getAllCategories, getPostsByCategory, POSTS_PER_PAGE } from '@/utils/blog-mdx';
import { CategoryNav } from '@/components/blog/CategoryNav';
import BlogPostsList from '@/components/blog/BlogPostsList';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function CategoryContent({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const decodedCategory = decodeURIComponent(category);
  
  const allCategories = await getAllCategories();
  const exactCategory = allCategories.find(
    (cat) => cat.toLowerCase() === decodedCategory.toLowerCase()
  );
  
  if (!exactCategory) {
    notFound();
  }
  
  const posts = await getPostsByCategory(exactCategory);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  
  return (
    <section className="section-wrapper section-spacing">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Category: {exactCategory}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
        </p>
      </div>
      
      <CategoryNav categories={allCategories} />
      
      <BlogPostsList
        posts={posts}
        postsPerPage={POSTS_PER_PAGE}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/category/${category}`}
        showPostCount={true}
      />
    </section>
  );
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}