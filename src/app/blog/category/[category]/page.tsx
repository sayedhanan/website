import { getAllCategories, getPaginatedPostsByCategory } from '@/utils/blog-mdx';
import ArticleCard from '@/components/ui/article-card';
import { CategoryNav } from '@/components/blog/CategoryNav';
import Pagination from '@/components/blog/Pagination';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  // Await both params and searchParams
  const { category } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const decodedCategory = decodeURIComponent(category);
  
  // Find the exact category with proper casing
  const allCategories = await getAllCategories();
  const exactCategory = allCategories.find(
    (cat) => cat.toLowerCase() === decodedCategory.toLowerCase()
  );
  
  if (!exactCategory) {
    notFound();
  }
  
  const { posts, totalPages } = await getPaginatedPostsByCategory(
    exactCategory,
    currentPage
  );
  
  return (
    <section className="section-wrapper section-spacing">
      <h1 className="text-3xl font-bold mb-6">Category: {exactCategory}</h1>
      
      <CategoryNav categories={allCategories} />
      
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
            categoryPath={category}
          />
        </>
      ) : (
        <p className="mt-8">No posts found in this category.</p>
      )}
    </section>
  );
}
