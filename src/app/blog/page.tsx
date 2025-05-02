// src/app/blog/page.tsx
import { getPostSlugs, getPostBySlug } from '@/utils/blog-mdx';
import ArticleCard from '@/components/ui/article-card';
import Pagination from '@/components/blog/Pagination';
import { BlogHero } from '@/components/blog/Hero';

export const dynamic = 'force-static';
export const revalidate = false;

// 1️⃣ Props now declare params & searchParams as Promises
type BlogPageProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage(props: BlogPageProps) {
  // 2️⃣ Await both before using
  const { page = '1' } = await props.searchParams;
  const pageNumber = parseInt(page, 10);

  const slugs = getPostSlugs();
  const postsData = await Promise.all(slugs.map(slug => getPostBySlug(slug)));


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
