// src/components/home/RecentPostsSection.tsx
import { getPosts, type Post } from "@/utils/api";
import { ArticleCard } from "@/components/ui/article-card";

export default async function RecentPostsSection() {
  const { posts }: { posts: Post[] } = await getPosts({ page: 1, limit: 3 });

  return (
    <section className="section-wrapper section-spacing" aria-labelledby="recent-posts">
      <h2 id="recent-posts" className="text-3xl font-semibold text-[var(--color-primary-text)] mb-6">
        Recent Posts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Post) => (
          <ArticleCard
            key={post.slug}
            href={`/blog/${post.slug}`}
            title={post.title}
            excerpt={post.excerpt}
            date={post.date}
            readingTime={post.readingTime}
          />
        ))}
      </div>
    </section>
  );
}
