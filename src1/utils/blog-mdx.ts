// src/utils/blog-mdx.ts - Add pagination utility functions
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
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
}

export interface PaginatedPosts {
  posts: Post[];
  currentPage: number;
  totalPages: number;
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
        rehypePlugins: [[rehypePrettyCode, options]],
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
    readingTime:
      data.readingTime?.toString() || readingTime(mdxSource).text,
    abstract,
    content,
    categories: data.categories || [],
    tags: data.tags || [],
    draft: data.draft === true
  };
}

export async function getAllPosts(includesDrafts = false): Promise<Post[]> {
  const slugs = getPostSlugs();
  const posts = await Promise.all(slugs.map(async (slug) => getPostBySlug(slug)));

  // Filter out drafts if not explicitly included
  const filteredPosts = includesDrafts 
    ? posts 
    : posts.filter(post => !post.draft);

  // Sort by date (newest first)
  return filteredPosts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPaginatedPosts(page = 1, includesDrafts = false): Promise<PaginatedPosts> {
  const allPosts = await getAllPosts(includesDrafts);
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  // Ensure page is within valid range
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
  
  posts.forEach(post => {
    if (post.categories && Array.isArray(post.categories)) {
      post.categories.forEach(category => categoriesSet.add(category));
    }
  });
  
  return Array.from(categoriesSet);
}

export async function getPostsByCategory(category: string, includesDrafts = false): Promise<Post[]> {
  const allPosts = await getAllPosts(includesDrafts);
  return allPosts.filter(post => 
    post.categories && post.categories.includes(category)
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
  
  // Ensure page is within valid range
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
  
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet);
}

export async function getPostsByTag(tag: string, includesDrafts = false): Promise<Post[]> {
  const allPosts = await getAllPosts(includesDrafts);
  return allPosts.filter(post => 
    post.tags && post.tags.includes(tag)
  );
}

export async function getPaginatedPostsByTag(
  tag: string, 
  page = 1, 
  includesDrafts = false
): Promise<PaginatedPosts & { tag: string }> {
  const allTagPosts = await getPostsByTag(tag, includesDrafts);
  const totalPosts = allTagPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  // Ensure page is within valid range
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