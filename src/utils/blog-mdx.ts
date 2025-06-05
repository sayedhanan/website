// src/utils/blog-mdx.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { readFile } from 'node:fs/promises';

const postsDir = path.join(process.cwd(), 'src', 'content', 'blog');
const theme = JSON.parse(
  await readFile(
    path.join(process.cwd(), 'src', 'themes', 'one-dark-pro.json'),
    'utf-8'
  )
);

// Number of posts to show per page
export const POSTS_PER_PAGE = 6;

export interface TOCItem {
  id: string;
  title: string;
  level: 2 | 3 | 4 | 5 | 6;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  abstract: string;
  content: React.ReactNode;
  categories: string[];
  tags: string[];
  draft: boolean;
  toc: TOCItem[];
}

export interface PaginatedPosts {
  posts: Post[];
  currentPage: number;
  totalPages: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Extract headings and generate TOC with proper slug generation that matches rehype-slug
// ─────────────────────────────────────────────────────────────────────────────
function extractTOCFromMdx(source: string): TOCItem[] {
  const lines = source.split('\n');
  const toc: TOCItem[] = [];

  for (const line of lines) {
    // Match lines that start with "## ", "### ", "#### ", etc.
    const match = line.match(/^(#{2,6})\s+(.*)$/);
    if (match) {
      const level = match[1].length as 2 | 3 | 4 | 5 | 6;
      const rawText = match[2].trim();
      
      // Generate slug the same way rehype-slug does
      const id = rawText
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/[^\w\-\u4e00-\u9fa5]/g, '') // Remove special chars, keep Chinese chars
        .replace(/--+/g, '-')          // Replace multiple hyphens with single
        .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
      
      if (id) { // Only add if we have a valid ID
        toc.push({ id, title: rawText, level });
      }
    }
  }

  return toc;
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

  // Generate TOC before MDX compilation
  const toc = extractTOCFromMdx(mdxSource);

  const prettyCodeOptions = {
    theme,
    defaultLang: 'python',
    keepBackground: false,
    onVisitLine(node: { children: unknown[]; properties: { className?: string[] } }) {
      if (node.children.length === 0) {
        node.children = [{ type: 'text', value: ' ' }];
      }
      node.properties.className = ['line'];
    },
    onVisitHighlightedLine(node: { properties: { className: string[] } }) {
      node.properties.className.push('highlight-line');
    },
    onVisitHighlightedWord(node: { properties: { className: string[] } }) {
      node.properties.className = ['word'];
    },
  };

  const { content } = await compileMDX({
    source: mdxSource,
    options: {
      mdxOptions: {
        rehypePlugins: [
          // Add rehype-slug to automatically generate IDs for headings
          rehypeSlug,
          // Keep your existing pretty code plugin
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
    },
  });

  const abstract =
    data.excerpt?.toString() ||
    mdxSource.trim().slice(0, 200) + (mdxSource.length > 200 ? '…' : '');

  return {
    slug,
    title: data.title.toString(),
    date: data.date.toString(),
    readingTime: data.readingTime?.toString() || readingTime(mdxSource).text,
    abstract,
    content,
    categories: data.categories || [],
    tags: data.tags || [],
    draft: data.draft === true,
    toc,
  };
}

export async function getAllPosts(includesDrafts = false): Promise<Post[]> {
  const slugs = getPostSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)));

  const filteredPosts = includesDrafts ? posts : posts.filter((post) => !post.draft);

  return filteredPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPaginatedPosts(
  page = 1,
  includesDrafts = false
): Promise<PaginatedPosts> {
  const allPosts = await getAllPosts(includesDrafts);
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    currentPage,
    totalPages,
  };
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categoriesSet = new Set<string>();

  posts.forEach((post) => {
    if (post.categories && Array.isArray(post.categories)) {
      post.categories.forEach((category) => categoriesSet.add(category));
    }
  });

  return Array.from(categoriesSet);
}

export async function getPostsByCategory(
  category: string,
  includesDrafts = false
): Promise<Post[]> {
  const allPosts = await getAllPosts(includesDrafts);
  return allPosts.filter(
    (post) => post.categories && post.categories.includes(category)
  );
}

export async function getPaginatedPostsByCategory(
  category: string,
  page = 1,
  includesDrafts = false
): Promise<PaginatedPosts & { category: string }> {
  const allCategoryPosts = await getPostsByCategory(category, includesDrafts);
  const totalPosts = allCategoryPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allCategoryPosts.slice(startIndex, endIndex);

  return {
    posts,
    currentPage,
    totalPages,
    category,
  };
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag) => tagsSet.add(tag));
    }
  });

  return Array.from(tagsSet);
}

export async function getPostsByTag(
  tag: string,
  includesDrafts = false
): Promise<Post[]> {
  const allPosts = await getAllPosts(includesDrafts);
  return allPosts.filter((post) => post.tags && post.tags.includes(tag));
}

export async function getPaginatedPostsByTag(
  tag: string,
  page = 1,
  includesDrafts = false
): Promise<PaginatedPosts & { tag: string }> {
  const allTagPosts = await getPostsByTag(tag, includesDrafts);
  const totalPosts = allTagPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allTagPosts.slice(startIndex, endIndex);

  return {
    posts,
    currentPage,
    totalPages,
    tag,
  };
}