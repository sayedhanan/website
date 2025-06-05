// src/app/blog/page.tsx
import { getPaginatedPosts, getAllCategories } from '@/utils/blog-mdx';
import ArticleCard from '@/components/ui/article-card';
import { CategoryNav } from '@/components/blog/CategoryNav';
import Pagination from '@/components/blog/Pagination';

interface BlogPageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const { posts, totalPages } = await getPaginatedPosts(currentPage);
  const categories = await getAllCategories();

  return (
    <section className="section-wrapper section-spacing">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      
      <CategoryNav categories={categories} />
      
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
      
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
}