import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { compileMDX } from 'next-mdx-remote/rsc'

// Only import rehype-pretty-code - we'll use the built-in theme support
import rehypePrettyCode from 'rehype-pretty-code'

export interface Post {
  slug: string
  title: string
  date: string
  readingTime: string
  abstract: string
  content: React.ReactNode
}

const postsDir = path.join(process.cwd(), 'src', 'content', 'blog')

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDir, `${slug}.mdx`)
  const raw = fs.readFileSync(fullPath, 'utf-8')
  const { data, content: mdxSource } = matter(raw)

  // Configure rehype-pretty-code with a simpler approach
  const options = {
    // Use the built-in theme without custom getHighlighter function
    theme: 'one-dark-pro',
    
    // Line handling
    onVisitLine(node: any) {
      if (node.children.length === 0) {
        node.children = [{ type: 'text', value: ' ' }]
      }
      node.properties.className = ['line']
    },
    // Highlighted line handling
    onVisitHighlightedLine(node: any) {
      node.properties.className.push('highlight-line')
    },
    // Highlighted word handling
    onVisitHighlightedWord(node: any) {
      node.properties.className = ['word']
    },
    // Don't keep the background from Shiki - we'll style it with Tailwind
    keepBackground: false,
  }

  // Import the custom components
  const { mdxComponents } = await import('./mdx-components')
  
  const { content } = await compileMDX({
    source: mdxSource,
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, options]],
      },
    },
    components: mdxComponents,
  })

  const abstract =
    typeof data.excerpt === 'string'
      ? data.excerpt
      : mdxSource.trim().slice(0, 200) + (mdxSource.length > 200 ? '…' : '')

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    readingTime: data.readingTime ?? readingTime(mdxSource).text,
    abstract,
    content,
  }
}