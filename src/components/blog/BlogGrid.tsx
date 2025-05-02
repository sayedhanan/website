// src/components/blog/BlogGrid.tsx
import { getAllPosts, type Post } from "@/utils/blog-mdx";
import { ArticleCard } from "@/components/ui/article-card";
import Pagination from "@/components/blog/Pagination";

interface BlogGridProps {
  searchParams: { page?: string };
}

export default function BlogGrid({ searchParams }: BlogGridProps) {
  const allPosts: Omit<Post, "content">[] = getAllPosts();

  const page = parseInt(searchParams?.page ?? "1", 10);
  const limit = 9;
  const totalPages = Math.ceil(allPosts.length / limit);
  const posts = allPosts.slice((page - 1) * limit, page * limit);

  return (
    <section className="section-wrapper section-spacing">
      <h1 className="text-4xl font-semibold text-[var(--color-primary-text)] mb-6">
        All Posts
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Omit<Post, "content">) => (
          <ArticleCard
            key={post.slug}
            href={`/blog/${post.slug}`}
            title={post.title}
            excerpt={post.excerpt}           // ← now exists
            date={post.date}
            readingTime={post.readingTime}
          />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </section>
  );
}
