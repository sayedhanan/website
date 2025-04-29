// src/app/blog/[slug]/page.tsx
import { getPostBySlug, getPostSlugs, type Post } from "@/utils/mdx"; // Added getPostSlugs import
import { MDXRemote } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug: string) => ({ slug })); // Added type annotation for slug
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post: Post = await getPostBySlug(slug);

  return (
    <article className="section-wrapper section-spacing prose">
      <h1>{post.title}</h1>
      <time dateTime={post.date}>{post.date}</time>
      <MDXRemote source={post.content} />
    </article>
  );
}