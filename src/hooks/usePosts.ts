// src/hooks/usePosts.ts
"use client";

import { useState, useEffect } from "react";
import { getPosts, type Post } from "@/utils/api"; // ← import getPosts and Post

interface UsePostsOptions {
  initialPage?: number;
  limit?: number;
}

export function usePosts({ initialPage = 1, limit = 9 }: UsePostsOptions) {
  const [posts, setPosts]     = useState<Post[]>([]);      // ← typed as Post[]
  const [page, setPage]       = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    getPosts({ page, limit })
      .then(({ posts: data, total }: { posts: Post[]; total: number }) => {
        if (!mounted) return;
        setPosts(prev =>
          page === 1
            ? data
            : [...prev, ...data]
        );
        setHasMore(page * limit < total);
      })
      .catch(err => {
        console.error("Error fetching posts:", err);
      });

    return () => {
      mounted = false;
    };
  }, [page, limit]);

  return {
    posts,
    hasMore,
    loadMore: () => setPage(p => p + 1),
  };
}
