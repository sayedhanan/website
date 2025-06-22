'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Tag, X } from 'lucide-react';

interface NewsletterItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  substackUrl: string;
}

interface NewsletterFilterProps {
  newsletters: NewsletterItem[];
  onFilterChange: (filtered: NewsletterItem[]) => void;
}

export default function NewsletterFilter({ newsletters, onFilterChange }: NewsletterFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique years and tags
  const { availableYears, availableTags } = useMemo(() => {
    const years = [...new Set(newsletters.map(n => new Date(n.date).getFullYear().toString()))]
      .sort((a, b) => parseInt(b) - parseInt(a));
    const tags = [...new Set(newsletters.flatMap(n => n.tags))].sort();
    
    return {
      availableYears: years,
      availableTags: tags
    };
  }, [newsletters]);

  // Filter newsletters based on all criteria
  const filteredNewsletters = useMemo(() => {
    let filtered = newsletters;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(newsletter => 
        newsletter.title.toLowerCase().includes(term) ||
        newsletter.excerpt.toLowerCase().includes(term) ||
        newsletter.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(newsletter => 
        new Date(newsletter.date).getFullYear().toString() === selectedYear
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(newsletter =>
        selectedTags.every(tag => newsletter.tags.includes(tag))
      );
    }

    return filtered;
  }, [newsletters, searchTerm, selectedYear, selectedTags]);

  // Update parent component when filters change
  React.useEffect(() => {
    onFilterChange(filteredNewsletters);
  }, [filteredNewsletters, onFilterChange]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedYear('all');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchTerm || selectedYear !== 'all' || selectedTags.length > 0;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 mb-8 sticky top-4 z-20 shadow-sm">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-secondary-text)] w-4 h-4" />
        <input
          type="text"
          placeholder="Search newsletters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent bg-[var(--color-background)] text-[var(--color-primary-text)]"
        />
      </div>

      {/* Filter Toggle & Results Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
          
          <div className="text-sm text-[var(--color-secondary-text)]">
            {filteredNewsletters.length} of {newsletters.length} newsletters
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="border-t border-[var(--color-border)] pt-4 space-y-4">
          {/* Year Filter */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-[var(--color-primary-text)] mb-2">
              <Calendar className="w-4 h-4" />
              <span>Year</span>
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent bg-[var(--color-background)] text-[var(--color-primary-text)]"
            >
              <option value="all">All years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-[var(--color-primary-text)] mb-3">
              <Tag className="w-4 h-4" />
              <span>Topics</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                      : 'bg-transparent text-[var(--color-secondary-text)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="border-t border-[var(--color-border)] pt-4 mt-4">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <div className="flex items-center space-x-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-1 rounded-full text-xs">
                <span>Search: "{searchTerm}"</span>
                <button onClick={() => setSearchTerm('')}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {selectedYear !== 'all' && (
              <div className="flex items-center space-x-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-1 rounded-full text-xs">
                <span>Year: {selectedYear}</span>
                <button onClick={() => setSelectedYear('all')}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {selectedTags.map(tag => (
              <div key={tag} className="flex items-center space-x-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-1 rounded-full text-xs">
                <span>#{tag}</span>
                <button onClick={() => toggleTag(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}