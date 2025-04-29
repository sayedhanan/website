// app/blog/page.tsx
import { getAllPosts, type Post } from "@/utils/mdx";
import BlogGrid from "@/components/blog/BlogGrid";

export default async function BlogPage() {
  const posts: Omit<Post, "content">[] = getAllPosts();
  return <BlogGrid posts={posts} />;
}
