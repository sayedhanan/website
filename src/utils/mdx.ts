import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrismPlus from 'rehype-prism-plus';

const postsDir = path.join(process.cwd(), 'src', 'content', 'blog');

export interface Post {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  abstract: string;
  content: React.ReactNode;
}

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDir, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, 'utf-8');

  const { data, content: mdxSource } = matter(raw);

  // Using rehype-prism-plus for syntax highlighting
  const { content } = await compileMDX({
    source: mdxSource,
    options: {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [
          [rehypePrismPlus, { 
            ignoreMissing: true,
            showLineNumbers: false,
            defaultLanguage: 'text',
            // Add this line to ensure proper language class application
            transformInlineCode: false,
            // Make sure we're using the right class structure
            classPrefix: 'language-'
          }]
        ],
      },
    },
  });

  const abstract =
    typeof data.excerpt === 'string'
      ? data.excerpt
      : mdxSource.trim().slice(0, 200) + (mdxSource.length > 200 ? '…' : '');

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    readingTime: data.readingTime ?? readingTime(mdxSource).text,
    abstract,
    content,
  };
}