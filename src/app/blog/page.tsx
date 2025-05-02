import React from 'react';
import { getPostSlugs, getPostBySlug, type Post } from '@/utils/blog-mdx';
import ArticleCard from '@/components/ui/article-card';
import Pagination from '@/components/blog/Pagination';
import { BlogHero } from '@/components/blog/Hero';

export const dynamic = 'force-static';
export const revalidate = false;

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams;
  const pageNumber = parseInt(page ?? '1', 10);

  // Load all post slugs and fetch metadata for each post
  const slugs = getPostSlugs();
  const postsData = await Promise.all(
    slugs.map((slug) => getPostBySlug(slug))
  );

  // Strip out `content` to match ArticleCard props
  const allPosts: Omit<Post, 'content'>[] = postsData.map(({ content, ...meta }) => meta);

  const limit = 9;
  const totalPages = Math.ceil(allPosts.length / limit);
  const posts = allPosts.slice((pageNumber - 1) * limit, pageNumber * limit);

  return (
    <>
      <BlogHero />
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
        <Pagination currentPage={pageNumber} totalPages={totalPages} />
      </section>
    </>
  );
}