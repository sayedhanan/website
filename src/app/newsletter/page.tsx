// File: src/app/newsletter/page.tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface NewsletterItem {
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
    const data = matter(
      fs.readFileSync(path.join(dir, file), 'utf8')
    ).data;
    return {
      slug: file.replace(/\.md$/, ''),
      title: data.title ?? 'Untitled',
      date: data.date ?? new Date().toISOString(),
      excerpt: data.excerpt ?? '',
      readTime: data.readTime ?? '5 min read',
      tags: data.tags ?? [],
      substackUrl: data.substackUrl ?? '#',
    };
  });

  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function groupByYear(newsletters: NewsletterItem[]) {
  return newsletters.reduce((acc, item) => {
    const y = new Date(item.date).getFullYear();
    if (!acc[y]) acc[y] = [];
    acc[y].push(item);
    return acc;
  }, {} as Record<number, NewsletterItem[]>);
}

export default async function NewsletterPage() {
  const newsletters = await getNewsletters();
  const grouped = groupByYear(newsletters);
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[var(--color-accent)] text-[var(--color-surface)]">
        {/* ...hero unchanged... */}
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-[var(--color-primary-text)]">
        {newsletters.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
              <svg className="w-12 h-12 text-[var(--color-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-primary-text)] mb-4">Coming Soon</h3>
            <p className="text-[var(--color-secondary-text)] text-lg">
              The first newsletter is in the works. Stay tuned for insights on AI, tech, and more!
            </p>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Issues Published */}
              <div className="card hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[var(--color-info-bg)] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--color-info)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-[var(--color-primary-text)]">{newsletters.length}</p>
                    <p className="text-[var(--color-secondary-text)]">Issues Published</p>
                  </div>
                </div>
              </div>

              {/* Publishing Schedule */}
              <div className="card hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[var(--color-success-bg)] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-[var(--color-primary-text)]">Weekly</p>
                    <p className="text-[var(--color-secondary-text)]">Publishing Schedule</p>
                  </div>
                </div>
              </div>

              {/* Topics Covered */}
              <div className="card hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[var(--color-warning-bg)] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--color-warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-[var(--color-primary-text)]">{[...new Set(newsletters.flatMap(n => n.tags))].length}</p>
                    <p className="text-[var(--color-secondary-text)]">Topics Covered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Timeline */}
            <div className="relative">
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-[var(--color-accent)]/50"></div>

              {years.map((year) => (
                <div key={year} className="mb-16">
                  {/* Year marker */}
                  <div className="relative flex items-center mb-8">
                    <div className="absolute left-4 md:left-6 w-6 h-6 bg-[var(--color-accent)] rounded-full border-4 border-[var(--color-background)] shadow-lg z-10"></div>
                    <h2 className="ml-16 md:ml-20 text-3xl font-bold text-[var(--color-primary-text)]">
                      {year}
                    </h2>
                  </div>

                  {/* Newsletter items */}
                  <div className="space-y-8">
                    {grouped[year].map((item) => (
                      <article key={item.slug} className="relative group">
                        <div className="absolute left-5 md:left-7 w-2 h-2 bg-[var(--color-border)] rounded-full border-2 border-[var(--color-background)] shadow group-hover:bg-[var(--color-accent)] transition-colors z-10"></div>

                        <div className="ml-16 md:ml-20">
                          <div className="card hover:shadow-xl hover:border-[var(--color-accent)] transition-all duration-500 overflow-hidden group-hover:-translate-y-1 rounded-lg">
                            <div className="p-6 pb-4">
                              <div className="flex flex-wrap items-center gap-3 mb-4">
                                <time className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-border)] hover:bg-[var(--color-surface)] dark:bg-[var(--color-surface)] dark:hover:bg-[var(--color-border)] transition-colors text-[var(--color-primary-text)]">
                                  {formatDate(item.date)}
                                </time>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-border)] hover:bg-[var(--color-surface)] dark:bg-[var(--color-surface)] dark:hover:bg-[var(--color-border)] transition-colors text-[var(--color-primary-text)]">
                                  {item.readTime}
                                </span>
                              </div>

                              <h3 className="card-title text-xl md:text-2xl group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                                <a
                                  href={item.substackUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="card-link hover:underline decoration-2 underline-offset-4"
                                >
                                  {item.title}
                                </a>
                              </h3>

                              <p className="card-excerpt !text-base md:!text-lg !line-clamp-none leading-relaxed mb-6">
                                {item.excerpt}
                              </p>

                              {/* Tags */}
                              {item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                  {item.tags.map(tag => (
                                    <span
                                      key={tag}
                                      className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-border)] hover:bg-[var(--color-surface)] dark:bg-[var(--color-surface)] dark:hover:bg-[var(--color-border)] transition-colors text-[var(--color-primary-text)] cursor-pointer"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <a
                                href={item.substackUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 font-medium transition-colors group"
                              >
                                Read more
                                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA Section */}
            <div className="mt-20 bg-[var(--color-accent)] rounded-lg p-8 md:p-12 text-[var(--color-surface)] text-center overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Stay in the Loop
                </h3>
                <p className="text-[var(--color-surface)] text-lg mb-8 max-w-2xl mx-auto">
                  Get the latest insights on AI, tech trends, and computer science delivered to your inbox every week.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="button"
                    className="btn btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-accent]"
                  >
                    Subscribe Now
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-accent]"
                  >
                    Browse Archive
                  </button>
                </div>
              </div>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-surface)]/5 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-surface)]/5 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}