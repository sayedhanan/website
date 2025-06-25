// File: app/blog/category/[category]/page.tsx
import { getAllCategories, getPostsByCategory } from '@/utils/blog-mdx';
import { CategoryNav } from '@/components/blog/CategoryNav';
import LoadMoreButton from '@/components/blog/LoadMoreButton';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  
  const allCategories = await getAllCategories();
  const exactCategory = allCategories.find(
    (cat) => cat.toLowerCase() === decodedCategory.toLowerCase()
  );
  
  if (!exactCategory) {
    notFound();
  }
  
  const posts = await getPostsByCategory(exactCategory);
  
  return (
    <section className="section-wrapper section-spacing">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Category: {exactCategory}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
        </p>
      </div>
      
      <CategoryNav categories={allCategories} />
      
      <LoadMoreButton 
        posts={posts}
        showPostCount={true}
      />
    </section>
  );
}