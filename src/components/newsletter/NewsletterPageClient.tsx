// File: src/components/newsletter/NewsletterPageClient.tsx

'use client';

import React, { useState, useCallback } from 'react';
import NewsletterFilter from '@/components/newsletter/NewsletterFilter';
import NewsletterTimeline from '@/components/newsletter/NewsletterTimeline';
import NewsletterStats from '@/components/newsletter/NewsletterStats';
import { ExternalLink, Mail } from 'lucide-react';

interface NewsletterItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  substackUrl: string;
}

interface NewsletterPageClientProps {
  newsletters: NewsletterItem[];
}

export default function NewsletterPageClient({ newsletters }: NewsletterPageClientProps) {
  const [filteredNewsletters, setFilteredNewsletters] = useState<NewsletterItem[]>(newsletters);

  const handleFilterChange = useCallback((filtered: NewsletterItem[]) => {
    setFilteredNewsletters(filtered);
  }, []);

  return (
    <>
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
          {/* Stats Section */}
          <div id="archive" className="mb-12">
            <NewsletterStats newsletters={newsletters} />
          </div>

          {/* Filter Section */}
          <NewsletterFilter 
            newsletters={newsletters} 
            onFilterChange={handleFilterChange}
          />

          {/* Timeline Section */}
          <NewsletterTimeline 
            newsletters={filteredNewsletters}
            showLoadMore={true}
            initialCount={8}
          />

          {/* Subscribe CTA Section */}
          <div id="subscribe" className="mt-20 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent)]/80 rounded-xl p-8 md:p-12 text-[var(--color-surface)] text-center overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Never Miss an Issue
              </h3>
              
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Join a community of curious minds exploring the frontiers of technology. 
                Get weekly insights delivered straight to your inbox, absolutely free.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#" // Replace with your Substack subscribe URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary bg-white text-[var(--color-accent)] hover:bg-white/90 transition-all transform hover:scale-105 flex items-center"
                >
                  Subscribe on Substack
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                
                <div className="flex items-center text-white/80 text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Free • No spam • Unsubscribe anytime
                </div>
              </div>
              
              {/* Social proof */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-white/70 text-sm mb-4">Trusted by readers from</p>
                <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm">
                  <span>🏢 Google</span>
                  <span>🏢 Microsoft</span>
                  <span>🏢 OpenAI</span>
                  <span>🎓 Stanford</span>
                  <span>🎓 MIT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar - Optional */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-[var(--color-primary-text)] mb-4">
                What readers are saying
              </h3>
              <div className="space-y-4">
                <blockquote className="card p-6 border-l-4 border-[var(--color-accent)]">
                  <p className="text-[var(--color-secondary-text)] italic mb-3">
                    "Incredibly insightful content that keeps me updated on the latest in AI without the hype."
                  </p>
                  <footer className="text-sm text-[var(--color-secondary-text)]">
                    — Sarah Chen, ML Engineer
                  </footer>
                </blockquote>
                
                <blockquote className="card p-6 border-l-4 border-[var(--color-accent)]">
                  <p className="text-[var(--color-secondary-text)] italic mb-3">
                    "Perfect balance of technical depth and accessibility. A must-read for anyone in tech."
                  </p>
                  <footer className="text-sm text-[var(--color-secondary-text)]">
                    — Alex Rodriguez, Software Architect
                  </footer>
                </blockquote>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-[var(--color-primary-text)] mb-4">
                Newsletter Topics
              </h3>
              <div className="space-y-3">
                {[...new Set(newsletters.flatMap(n => n.tags))]
                  .slice(0, 8)
                  .map(tag => (
                    <div key={tag} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-secondary-text)]">#{tag}</span>
                      <span className="text-[var(--color-accent)] font-medium">
                        {newsletters.filter(n => n.tags.includes(tag)).length}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}