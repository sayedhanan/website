// src/utils/notes-mdx.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
// Math support
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readFile } from 'node:fs/promises';
import type { ReactNode } from 'react';
// Import the CodeTabs components
import CodeTabs, { QuickCodeTabs } from "@/components/code/CodeTabs"

/** Root folder for all your .mdx notes */
const NOTES_CONTENT_PATH = path.join(process.cwd(), 'src', 'content', 'notes');

// Define theme type for better type safety
type Theme = string | Record<string, unknown>;

// Load theme for syntax highlighting - make it a function for async loading
async function loadTheme(): Promise<Theme> {
  try {
    const themeFile = await readFile(
      path.join(process.cwd(), 'src', 'themes', 'one-dark-pro.json'),
      'utf-8'
    );
    return JSON.parse(themeFile) as Record<string, unknown>;
  } catch {
    console.warn('Could not load theme file, using default theme');
    return 'github-dark';
  }
}

// MDX Components available in your notes
const mdxComponents = {
  CodeTabs,
  QuickCodeTabs,
  // Add any other custom components you want to use in MDX
};

// Ensure content path exists
if (typeof window === 'undefined' && !fs.existsSync(NOTES_CONTENT_PATH)) {
  try {
    fs.mkdirSync(NOTES_CONTENT_PATH, { recursive: true });
    console.log(`Created notes content directory at ${NOTES_CONTENT_PATH}`);
  } catch (err) {
    console.error(`Failed to create notes content directory: ${err}`);
  }
}

/** URL slug parts, e.g. ['ml-engineering','supervised'] */
export type Slug = string[];

/** Frontmatter structure */
export interface Frontmatter {
  title?: string;
  description?: string;
  order?: number;
  [key: string]: unknown;
}

/** What getNoteBySlug returns */
export interface LoadedNote {
  /** The rendered MDX as a React node */
  content: ReactNode;
  /** Your front-matter fields (title, description, order, etc.) */
  frontmatter: Frontmatter;
}

/** Tree structure for sidebar/navigation */
export interface NoteNode {
  slug: string;
  title: string;
  order: number;
  description?: string;
  path: string; // Full path for direct linking
  children: NoteNode[];
}

/**
 * Find the full path to a node in the tree
 */
export function findNodePath(
  targetNode: NoteNode,
  nodes: NoteNode[]
): NoteNode[] | null {
  for (const node of nodes) {
    if (node.path === targetNode.path) {
      return [node];
    }

    // Check children recursively
    const childPath = findNodePath(targetNode, node.children);
    if (childPath) {
      return [node, ...childPath];
    }
  }
  return null;
}

/**
 * Per-folder manifest schema.
 * If you use `_meta.json` to explicitly list children/order.
 */
interface FolderMeta {
  title?: string;
  order?: number;
  description?: string;
  // If children is defined, only these items will be included
  children?: {
    slug: string;
    title?: string;
    order?: number;
    description?: string;
  }[];
}

/** Read `_meta.json` if present, else null */
function readFolderMeta(dirPath: string): FolderMeta | null {
  const metaFile = path.join(dirPath, '_meta.json');
  if (!fs.existsSync(metaFile)) return null;
  return JSON.parse(fs.readFileSync(metaFile, 'utf-8')) as FolderMeta;
}

/** Read just the front-matter from an MDX file */
function readMDXFrontmatter(filePath: string): Frontmatter {
  if (!fs.existsSync(filePath)) return {};
  const src = fs.readFileSync(filePath, 'utf-8');
  return matter(src).data as Frontmatter;
}

/**
 * Build the full notes tree (for sidebar) by recursing
 * into each folder under NOTES_CONTENT_PATH.
 */
export function getNotesTree(): NoteNode[] {
  function buildNode(dirPath: string, parentPath: string = '/notes'): NoteNode[] {
    // Ensure directory exists
    if (!fs.existsSync(dirPath)) return [];

    const folderName = path.basename(dirPath);
    const currentPath = `${parentPath}/${folderName}`;
    const folderMeta = readFolderMeta(dirPath);

    // Try to read index.mdx for frontmatter
    const indexMDX = path.join(dirPath, 'index.mdx');
    const indexFm = readMDXFrontmatter(indexMDX);

    // Always create a node for the directory itself (if index.mdx exists)
    const title = folderMeta?.title || indexFm.title || folderName;
    const description = folderMeta?.description || indexFm.description;
    const order = folderMeta?.order ?? indexFm.order ?? 0;

    const nodes: NoteNode[] = [];
    if (fs.existsSync(indexMDX)) {
      nodes.push({
        slug: folderName,
        title,
        order,
        description,
        path: currentPath,
        children: [],
      });
    }

    // Process child entries based on _meta.json (if exists) or directory contents
    let childEntries: {
      slug: string;
      title?: string;
      order?: number;
      description?: string;
    }[] = [];

    if (folderMeta?.children) {
      // Use explicit children from _meta.json
      childEntries = folderMeta.children;
    } else {
      // Scan directory for MDX files and subdirectories
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      childEntries = entries
        .filter(
          (entry) =>
            (entry.isDirectory() && entry.name !== 'node_modules') ||
            (entry.isFile() &&
              entry.name.endsWith('.mdx') &&
              entry.name !== 'index.mdx')
        )
        .map((entry) => ({
          slug: entry.name.replace(/\.mdx$/, ''),
          // Will be populated later
          title: undefined,
          order: undefined,
        }));
    }

    // Process each child entry
    for (const childEntry of childEntries) {
      const childSlug = childEntry.slug;
      const childPath = path.join(dirPath, childSlug);

      if (fs.existsSync(childPath) && fs.lstatSync(childPath).isDirectory()) {
        // It's a directory, recurse
        const subNodes = buildNode(childPath, `${currentPath}`);
        nodes.push(...subNodes);
      } else {
        // It's an MDX file (or should be)
        const mdxPath = `${childPath}.mdx`;
        if (fs.existsSync(mdxPath)) {
          const fm = readMDXFrontmatter(mdxPath);
          nodes.push({
            slug: childSlug,
            title: childEntry.title || fm.title || childSlug,
            order: childEntry.order ?? fm.order ?? 0,
            description: childEntry.description || fm.description,
            path: `${currentPath}/${childSlug}`,
            children: [],
          });
        }
      }
    }

    return nodes;
  }

  // Start building from root directories
  let allNodes: NoteNode[] = [];
  const rootEntries = fs.existsSync(NOTES_CONTENT_PATH)
    ? fs.readdirSync(NOTES_CONTENT_PATH, { withFileTypes: true })
    : [];

  for (const entry of rootEntries) {
    if (entry.isDirectory()) {
      const dirPath = path.join(NOTES_CONTENT_PATH, entry.name);
      const nodes = buildNode(dirPath);
      allNodes = [...allNodes, ...nodes];
    }
  }

  // Sort nodes by order then title
  allNodes.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  return allNodes;
}

/**
 * Get flat list of all available notes - Updated for SSG support
 */
export function getAllNotes(): {
  slug: string[];
  frontmatter: Frontmatter;
}[] {
  const notes: { slug: string[]; frontmatter: Frontmatter }[] = [];

  function traverse(dir: string, slugParts: string[] = []) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip non-content directories
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        traverse(fullPath, [...slugParts, entry.name]);
      } else if (entry.name.endsWith('.mdx')) {
        const slug =
          entry.name === 'index.mdx'
            ? slugParts
            : [...slugParts, entry.name.replace(/\.mdx$/, '')];

        const frontmatter = readMDXFrontmatter(fullPath);
        notes.push({ slug, frontmatter });
      }
    }
  }

  if (fs.existsSync(NOTES_CONTENT_PATH)) {
    traverse(NOTES_CONTENT_PATH);
  }

  return notes;
}

/**
 * Get all possible slug combinations for SSG
 * This function is specifically for generateStaticParams
 */
export function getAllNoteSlugs(): { slug: string[] }[] {
  const allNotes = getAllNotes();
  return allNotes.map(note => ({ slug: note.slug }));
}

/**
 * Organize notes into a hierarchical tree structure
 */
export function organizeNotesTree(): NoteNode[] {
  // Get all flat notes
  const allNotes = getAllNotes();
  const tree: NoteNode[] = [];

  // Create a map for quick access
  const nodeMap = new Map<string, NoteNode>();

  // First pass: create all nodes
  for (const note of allNotes) {
    const { slug, frontmatter } = note;

    if (slug.length === 0) continue; // Skip empty slugs

    // Convert slug to path
    const nodePath = '/notes/' + slug.join('/');

    // Create node
    const node: NoteNode = {
      slug: slug[slug.length - 1],
      title: frontmatter.title || slug[slug.length - 1],
      order: frontmatter.order || 0,
      description: frontmatter.description,
      path: nodePath,
      children: [],
    };

    // Add to map
    nodeMap.set(nodePath, node);

    // If it's a root-level note, add to tree
    if (slug.length === 1) {
      tree.push(node);
    }
  }

  // Second pass: build hierarchy
  for (const [nodePath, node] of nodeMap.entries()) {
    // Skip root-level nodes
    if (nodePath.split('/').length <= 3) continue;

    // Determine parent path
    const parentPath = nodePath.substring(0, nodePath.lastIndexOf('/'));
    const parent = nodeMap.get(parentPath);

    if (parent) {
      parent.children.push(node);
    } else {
      // Fallback to root if no parent found
      tree.push(node);
    }
  }

  // Sort the tree recursively
  function sortNode(node: NoteNode): void {
    node.children.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
    for (const child of node.children) {
      sortNode(child);
    }
  }

  for (const node of tree) {
    sortNode(node);
  }

  tree.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  return tree;
}

/**
 * Given a slug array, compile the matching .mdx file.
 * Returns `null` if file not found.
 * Updated to use async theme loading
 */
export async function getNoteBySlug(
  slugArr: Slug
): Promise<LoadedNote | null> {
  // Normalize the slugs (handle spaces and URL encoding)
  const normalizedSlugs = slugArr.map((s) => decodeURIComponent(s));

  let filePath = '';
  let fileExists = false;

  if (normalizedSlugs.length === 0) {
    // Root index case
    filePath = path.join(NOTES_CONTENT_PATH, 'index.mdx');
    fileExists = fs.existsSync(filePath);
  } else {
    // 1. Check for directory with index.mdx
    filePath = path.join(
      NOTES_CONTENT_PATH,
      ...normalizedSlugs,
      'index.mdx'
    );
    fileExists = fs.existsSync(filePath);

    // 2. If not found, check for an MDX file
    if (!fileExists) {
      filePath = path.join(
        NOTES_CONTENT_PATH,
        ...normalizedSlugs.slice(0, -1),
        `${normalizedSlugs[normalizedSlugs.length - 1]}.mdx`
      );
      fileExists = fs.existsSync(filePath);
    }

    // 3. Fallback: search directory contents for case-insensitive match
    if (!fileExists && normalizedSlugs.length > 0) {
      const dirPath =
        normalizedSlugs.length > 1
          ? path.join(
              NOTES_CONTENT_PATH,
              ...normalizedSlugs.slice(0, -1)
            )
          : NOTES_CONTENT_PATH;

      const lastSlug = normalizedSlugs[normalizedSlugs.length - 1];

      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        const exactMatch = files.find(
          (f) => f === `${lastSlug}.mdx` || f === lastSlug
        );
        const caseInsensitiveMatch = files.find(
          (f) =>
            f.toLowerCase() === `${lastSlug.toLowerCase()}.mdx` ||
            f.toLowerCase() === lastSlug.toLowerCase()
        );

        if (exactMatch) {
          filePath = path.join(dirPath, exactMatch);
          fileExists = true;
        } else if (caseInsensitiveMatch) {
          filePath = path.join(dirPath, caseInsensitiveMatch);
          fileExists = true;
        }
      }
    }
  }

  if (!fileExists) {
    console.log(`File not found for slug: ${normalizedSlugs.join('/')}`);
    console.log(`Attempted path: ${filePath}`);
    return null;
  }

  // Read raw MDX
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { content: mdxBody, data } = matter(raw);

  // Load theme asynchronously
  const theme = await loadTheme();

  // Configure rehype-pretty-code options
  const prettyCodeOptions = {
    theme,
    defaultLang: 'plaintext',
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

  // Compile MDX with the same plugins as blog
  const compiled = await compileMDX({
    source: mdxBody,
    components: mdxComponents, // Add the components here
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        // Math plugin for inline and block math
        remarkPlugins: [remarkMath],
        // Rehype plugins: slug, syntax highlighting, and KaTeX rendering
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, prettyCodeOptions],
          rehypeKatex,
        ],
      },
    },
  });

  return {
    content: compiled.content,
    frontmatter: {
      ...data,
      // Ensure title exists
      title: data.title || slugArr[slugArr.length - 1] || 'Untitled',
    } as Frontmatter,
  };
}

/**
 * Find a specific note in the tree by its slug array
 */
export function findNoteInTree(
  tree: NoteNode[],
  slugPath: string[]
): NoteNode | null {
  if (slugPath.length === 0) return null;

  // Normalize slug to handle spaces/URL encoding
  const normalizeSlug = (s: string) => s.replace(/%20/g, ' ');

  // Find root node
  const rootSlug = normalizeSlug(slugPath[0]);
  const rootNode =
    tree.find(
      (n) => n.slug === rootSlug || normalizeSlug(n.slug) === rootSlug
    ) || null;
  if (!rootNode || slugPath.length === 1) return rootNode;

  // Traverse children
  let currentNode: NoteNode = rootNode;
  for (let i = 1; i < slugPath.length; i++) {
    const seg = normalizeSlug(slugPath[i]);
    const child = currentNode.children.find(
      (n) => n.slug === seg || normalizeSlug(n.slug) === seg
    );
    if (!child) return null;
    currentNode = child;
  }

  return currentNode;
}