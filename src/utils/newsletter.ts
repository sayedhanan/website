// src/utils/newsletter.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface NewsletterMeta {
  id: number
  title: string
  excerpt: string
  date: string
  substackUrl: string
  tags: string[]
  readTime: string
}

/**
 * Reads all Markdown files in src/content/newsletters,
 * extracts frontmatter, and returns sorted metadata.
 */
export function getAllNewsletters(): NewsletterMeta[] {
  const dir = path.join(process.cwd(), 'src/content/newsletters')
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const source = fs.readFileSync(path.join(dir, f), 'utf-8')
      const { data } = matter(source)
      return data as NewsletterMeta
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
