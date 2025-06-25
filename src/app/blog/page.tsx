// File: app/blog/page.tsx
import { getAllCategories, getAllPosts } from '@/utils/blog-mdx';
import { CategoryNav } from '@/components/blog/CategoryNav';
import LoadMoreButton from '@/components/blog/LoadMoreButton';
import { metadata } from './metadata';

export { metadata };

export default async function BlogPage() {
  const allPosts = await getAllPosts();
  const categories = await getAllCategories();

  return (
    <section className="section-wrapper section-spacing">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Thoughts, tutorials, and insights on development
        </p>
      </div>

      <CategoryNav categories={categories} />

      <LoadMoreButton 
        posts={allPosts}
        showPostCount={true}
      />
    </section>
  );
}