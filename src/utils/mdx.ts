// src/utils/mdx.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { compileMDX } from 'next-mdx-remote/rsc';

const postsDir = path.join(process.cwd(), 'src', 'content', 'blog');

export interface Post {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  excerpt: string;
  content: string; // Changed to string instead of MDXRemoteSerializeResult
}

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDir, `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(source);

  // Simply pass the content as a string
  const excerpt =
    typeof data.excerpt === 'string'
      ? data.excerpt
      : content.trim().slice(0, 200) + (content.length > 200 ? '…' : '');
  const rt = data.readingTime ?? readingTime(content).text;

  return {
    slug,
    title: data.title,
    date: data.date,
    readingTime: rt,
    excerpt,
    content, // Just pass the raw content
  };
}

export function getAllPosts(): Omit<Post, 'content'>[] {
  return getPostSlugs()
    .map((slug) => {
      const fullPath = path.join(postsDir, `${slug}.mdx`);
      const source = fs.readFileSync(fullPath, 'utf-8');
      const { data, content } = matter(source);
      const excerpt =
        typeof data.excerpt === 'string'
          ? data.excerpt
          : content.trim().slice(0, 200) + (content.length > 200 ? '…' : '');
      const rt = data.readingTime ?? readingTime(content).text;
      return {
        slug,
        title: data.title,
        date: data.date,
        readingTime: rt,
        excerpt,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}