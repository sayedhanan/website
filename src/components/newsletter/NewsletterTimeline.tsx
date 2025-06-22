'use client';

import React, { useState } from 'react';
import { ArrowRight, Calendar, Clock, ExternalLink, Share2, Bookmark } from 'lucide-react';

interface NewsletterItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  substackUrl: string;
}

interface NewsletterTimelineProps {
  newsletters: NewsletterItem[];
  showLoadMore?: boolean;
  initialCount?: number;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

function groupByYear(newsletters: NewsletterItem[]) {
  return newsletters.reduce((acc, item) => {
    const year = new Date(item.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {} as Record<number, NewsletterItem[]>);
}

export default function NewsletterTimeline({ 
  newsletters, 
  showLoadMore = false, 
  initialCount = 10 
}: NewsletterTimelineProps) {
  const [displayCount, setDisplayCount] = useState(initialCount);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<Set<string>>(new Set());

  const displayedNewsletters = showLoadMore 
    ? newsletters.slice(0, displayCount)
    : newsletters;

  const grouped = groupByYear(displayedNewsletters);
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  const handleShare = async (newsletter: NewsletterItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsletter.title,
          text: newsletter.excerpt,
          url: newsletter.substackUrl,
        });
      } catch (err) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(newsletter.substackUrl);
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(newsletter.substackUrl);
    }
  };

  const toggleBookmark = (slug: string) => {
    setBookmarkedSlugs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };

  if (newsletters.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
          <svg className="w-12 h-12 text-[var(--color-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[var(--color-primary-text)] mb-4">No newsletters found</h3>
        <p className="text-[var(--color-secondary-text)] text-lg">
          Try adjusting your filters to see more content.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-[var(--color-accent)]/30"></div>

      {years.map((year) => (
        <div key={year} className="mb-16">
          {/* Year marker */}
          <div className="relative flex items-center mb-8">
            <div className="absolute left-4 md:left-6 w-6 h-6 bg-[var(--color-accent)] rounded-full border-4 border-[var(--color-background)] shadow-lg z-10 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="ml-16 md:ml-20">
              <h2 className="text-3xl font-bold text-[var(--color-primary-text)] mb-1">
                {year}
              </h2>
              <p className="text-[var(--color-secondary-text)]">
                {grouped[year].length} newsletter{grouped[year].length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Newsletter items */}
          <div className="space-y-8">
            {grouped[year].map((item, index) => (
              <article key={item.slug} className="relative group">
                {/* Timeline dot */}
                <div className="absolute left-5 md:left-7 w-2 h-2 bg-[var(--color-border)] rounded-full border-2 border-[var(--color-background)] shadow group-hover:bg-[var(--color-accent)] transition-colors z-10"></div>

                <div className="ml-16 md:ml-20">
                  <div className="card hover:shadow-xl hover:border-[var(--color-accent)] transition-all duration-500 overflow-hidden group-hover:-translate-y-1 rounded-lg">
                    <div className="p-6">
                      {/* Header with meta info */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <time 
                            className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-border)] hover:bg-[var(--color-surface)] dark:bg-[var(--color-surface)] dark:hover:bg-[var(--color-border)] transition-colors text-[var(--color-primary-text)] flex items-center gap-1"
                            title={formatDate(item.date)}
                          >
                            <Calendar className="w-3 h-3" />
                            {formatRelativeDate(item.date)}
                          </time>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-border)] hover:bg-[var(--color-surface)] dark:bg-[var(--color-surface)] dark:hover:bg-[var(--color-border)] transition-colors text-[var(--color-primary-text)] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.readTime}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleBookmark(item.slug)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              bookmarkedSlugs.has(item.slug)
                                ? 'bg-[var(--color-accent)] text-white'
                                : 'bg-[var(--color-surface)] text-[var(--color-secondary-text)] hover:text-[var(--color-accent)]'
                            }`}
                            title="Bookmark"
                          >
                            <Bookmark className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleShare(item)}
                            className="p-1.5 rounded-lg bg-[var(--color-surface)] text-[var(--color-secondary-text)] hover:text-[var(--color-accent)] transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="card-title text-xl md:text-2xl group-hover:text-[var(--color-accent)] transition-colors leading-tight mb-3">
                        <a
                          href={item.substackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-link hover:underline decoration-2 underline-offset-4"
                        >
                          {item.title}
                        </a>
                      </h3>

                      {/* Excerpt */}
                      <p className="card-excerpt !text-base md:!text-lg !line-clamp-none leading-relaxed mb-6 text-[var(--color-secondary-text)]">
                        {item.excerpt}
                      </p>

                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {item.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/20 transition-colors cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read more link */}
                      <a
                        href={item.substackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 font-medium transition-colors group/link"
                      >
                        Read on Substack
                        <ExternalLink className="w-4 h-4 ml-1.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}

      {/* Load More Button */}
      {showLoadMore && displayCount < newsletters.length && (
        <div className="text-center mt-12">
          <button
            onClick={() => setDisplayCount(prev => prev + initialCount)}
            className="btn btn-secondary hover:btn-primary transition-all duration-300 group"
          >
            Load More Newsletters
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-sm text-[var(--color-secondary-text)] mt-3">
            Showing {displayCount} of {newsletters.length} newsletters
          </p>
        </div>
      )}
    </div>
  );
}