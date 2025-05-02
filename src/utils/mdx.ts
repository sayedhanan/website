// utils/mdx.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
// import { transformerCopyButton } from '@rehype-pretty/transformers';
import { readFile } from 'node:fs/promises';

const postsDir = path.join(process.cwd(), 'src', 'content', 'blog');
const theme = JSON.parse(
  await readFile(
    path.join(process.cwd(), 'src', 'themes', 'one-dark-pro.json'),
    'utf-8'
  )
);

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

  const options = {
    theme,
    defaultLang: "python",
    keepBackground: false,
    transformers: [
      // transformerCopyButton({
      //   visibility: 'always',
      //   feedbackDuration: 3_000,
      // }),
    ],
    onVisitLine(node: any) {
      if (node.children.length === 0) {
        node.children = [{ type: 'text', value: ' ' }];
      }
      node.properties.className = ['line'];
    },
    onVisitHighlightedLine(node: any) {
      node.properties.className.push('highlight-line');
    },
    onVisitHighlightedWord(node: any) {
      node.properties.className = ['word'];
    },
  };

  const { content } = await compileMDX({
    source: mdxSource,
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, options]],
      },
    },
  });

  const abstract =
    data.excerpt?.toString() ||
    mdxSource.trim().slice(0, 200) +
      (mdxSource.length > 200 ? '…' : '');

  return {
    slug,
    title: data.title.toString(),
    date: data.date.toString(),
    readingTime:
      data.readingTime?.toString() || readingTime(mdxSource).text,
    abstract,
    content,
  };
}
