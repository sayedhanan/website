// File: src/components/blog/BlogGrid.tsx

import { getPostSlugs, getPostBySlug } from '@/utils/blog-mdx';
import ArticleCard from '@/components/ui/article-card';
import Pagination from '@/components/blog/Pagination';
import { use } from 'react';

type Params = Promise<Record<string, string>>;
type SearchParams = Promise<{ page?: string }>;

type BlogGridProps = {
  params: Params;
  searchParams: SearchParams;
};

export default function BlogGrid(props: BlogGridProps) {
  // Unwrap promises using React.use() in server components
  const { page = '1' } = use(props.searchParams);
  const pageNumber = parseInt(page, 10);

  // Fetch all post data
  const slugs = getPostSlugs();
  const postsData = use(Promise.all(slugs.map((slug) => getPostBySlug(slug))));

  // Transform to a lighter "Post" shape
  const allPosts = postsData.map((post) => ({
    slug: post.slug,
    title: post.title,
    abstract: post.abstract,
    date: post.date,
    readingTime: post.readingTime,
  }));

  const limit = 9;
  const totalPages = Math.ceil(allPosts.length / limit);
  const posts = allPosts.slice((pageNumber - 1) * limit, pageNumber * limit);

  return (
    <section className="section-wrapper section-spacing">
      <h1 className="text-4xl font-semibold mb-6">All Posts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <ArticleCard
            key={post.slug}
            href={`/blog/${post.slug}`}
            title={post.title}
            excerpt={post.abstract}
            date={post.date}
            readingTime={post.readingTime}
          />
        ))}
      </div>

      <Pagination
        currentPage={pageNumber}
        totalPages={totalPages}
        basePath="/blog"
        onPageChange={() => {
          // scroll back to top on page change
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </section>
  );
}
