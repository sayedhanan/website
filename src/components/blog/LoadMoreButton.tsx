'use client';

import { useState } from 'react';
import { Post } from '@/utils/blog-mdx';
import ArticleCard from '@/components/ui/article-card';

interface LoadMoreButtonProps {
  posts: Post[];
  showPostCount?: boolean;
  initialPostsCount?: number;
  loadMoreCount?: number;
}

export default function LoadMoreButton({
  posts,
  showPostCount = false,
  initialPostsCount = 2,
  loadMoreCount = 2,
}: LoadMoreButtonProps) {
  const [visibleCount, setVisibleCount] = useState(initialPostsCount);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < posts.length;
  const remainingPosts = posts.length - visibleCount;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + loadMoreCount, posts.length));
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showPostCount && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {visiblePosts.length} of {posts.length} posts
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.map((post) => (
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

      {hasMorePosts && (
        <div className="flex justify-start pt-8">
          <button
            onClick={loadMore}
            className="btn btn-primary"
          >
            Load More ({remainingPosts} remaining)
          </button>
        </div>
      )}
    </div>
  );
}