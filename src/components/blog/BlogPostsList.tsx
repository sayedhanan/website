// File: components/blog/BlogPostsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ArticleCard from '@/components/ui/article-card';
import ClientPagination from '@/components/blog/ClientPagination';
import type { Post } from '@/utils/blog-mdx';

interface BlogPostsListProps {
  posts: Post[];
  postsPerPage: number;
  currentPage: number;
  totalPages: number;
  basePath?: string;
  showPostCount?: boolean;
}

export default function BlogPostsList({
  posts,
  postsPerPage,
  currentPage: initialPage,
  totalPages,
  basePath = '/blog',
  showPostCount = false,
}: BlogPostsListProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Update local state when URL changes
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    
    const newUrl = params.toString() ? `${basePath}?${params.toString()}` : basePath;
    
    // Use router.replace for smooth navigation without page reload
    router.replace(newUrl, { scroll: false });
    
    // Smooth scroll to top of posts section
    setTimeout(() => {
      const element = document.querySelector('.posts-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  if (posts.length === 0) {
    return (
      <div className="mt-8 text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No posts found.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 posts-container">
      {showPostCount && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, posts.length)} of {posts.length} posts
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post) => (
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

      {totalPages > 1 && (
        <ClientPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}