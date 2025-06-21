import { getPostSlugs, getPostBySlug, type Post } from '@/utils/blog-mdx';
import ArticleCard from '@/components/ui/article-card';

export default async function RecentPostsSection() {
  const slugs = getPostSlugs();

  const posts: Post[] = await Promise.all(
    slugs.map((slug) => getPostBySlug(slug))
  );

  // Sort by date descending and pick top 3
  const recentPosts = posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section className="section-wrapper section-spacing" aria-labelledby="recent-posts">
      <h2 id="recent-posts" className="text-3xl font-semibold text-[var(--color-primary-text)] mb-6">
        Recent Posts
      </h2>
      <p className="text-[var(--color-secondary-text)] text-base mb-10 text-center sm:text-left max-w-2xl">
        Writing is how I think. These are my recent reflections, ideas, and experiments in machine learning, life, and building things that matter.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recentPosts.map((post) => (
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
    </section>
  );
}

