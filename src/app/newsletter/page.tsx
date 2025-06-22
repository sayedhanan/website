// File: src/app/newsletter/page.tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import React from 'react';
import NewsletterPageClient from '@/components/newsletter/NewsletterPageClient';

export interface NewsletterItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  substackUrl: string;
}

export const metadata = {
  title: 'Newsletter | Your Name',
  description: 'My newsletter archive – thoughts on CS, AI, and tech',
};

async function getNewsletters(): Promise<NewsletterItem[]> {
  const dir = path.join(process.cwd(), 'src/content/newsletters');
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const items: NewsletterItem[] = files.map(file => {
    const fullPath = path.join(dir, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      slug: file.replace(/\.md$/, ''),
      title: data.title ?? 'Untitled',
      date: data.date ?? new Date().toISOString(),
      excerpt: data.excerpt ?? data.description ?? '',
      readTime: data.readTime ?? '5 min read',
      tags: Array.isArray(data.tags) ? data.tags : [],
      substackUrl: data.substackUrl ?? data.url ?? '#',
    };
  });

  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default async function NewsletterPage() {
  const newsletters = await getNewsletters();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[var(--color-accent)] text-[var(--color-surface)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/90 to-[var(--color-accent)]"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Active Newsletter
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Weekly Insights
              <span className="block text-white/80">on Tech & AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Deep dives into computer science, artificial intelligence, and the future of technology. 
              Join thousands of readers staying ahead of the curve.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#subscribe"
                className="btn btn-primary bg-white text-[var(--color-accent)] hover:bg-white/90 transition-all transform hover:scale-105"
              >
                Subscribe Free
              </a>
              <a
                href="#archive"
                className="btn btn-secondary border-white/30 text-white hover:bg-white/10 transition-all"
              >
                Browse Archive
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <NewsletterPageClient newsletters={newsletters} />
      </div>
    </div>
  );
}