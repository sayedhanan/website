// src/utils/mdx.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

const postsDir = path.join(process.cwd(), "src", "content", "blog");

/** Post metadata & content */
export interface Post {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  excerpt: string;                          // ← added excerpt
  content: MDXRemoteSerializeResult;
}

/** Fetch all post slugs (without the .mdx extension) */
export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/** Load a single post by slug */
export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDir, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);
  const mdxSource = await serialize(content);

  // Use front-matter excerpt or fallback to first 200 chars of the raw content
  const excerptText =
    typeof data.excerpt === "string"
      ? data.excerpt
      : content.trim().slice(0, 200) + (content.length > 200 ? "…" : "");

  return {
    slug,
    title: data.title,
    date: data.date,
    readingTime: data.readingTime || readingTime(content).text,
    excerpt: excerptText,
    content: mdxSource,
  };
}

/** Fetch all posts metadata for listing */
export function getAllPosts(): Omit<Post, "content">[] {
  return getPostSlugs()
    .map((slug) => {
      const fullPath = path.join(postsDir, `${slug}.mdx`);
      const fileContents = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(fileContents);

      const excerptText =
        typeof data.excerpt === "string"
          ? data.excerpt
          : content.trim().slice(0, 200) + (content.length > 200 ? "…" : "");

      return {
        slug,
        title: data.title,
        date: data.date,
        readingTime: data.readingTime || readingTime(content).text,
        excerpt: excerptText,                // ← include excerpt here too
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}
