// src/utils/api.ts
export interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readingTime: string;
  }
  
  export async function getPosts({
    page = 1,
    limit = 9,
  }: { page?: number; limit?: number } = {}): Promise<{
    posts: Post[];
    total: number;
  }> {
    const res = await fetch(
      `https://example.com/api/posts?page=${page}&limit=${limit}`,
      { next: { revalidate: false } }
    );
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  }
  