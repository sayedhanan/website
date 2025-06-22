'use client';

import React, { useMemo } from 'react';
import { 
  FileText, 
  Calendar, 
  Tag, 
  TrendingUp,
  Clock,
  BarChart3
} from 'lucide-react';

interface NewsletterItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  substackUrl: string;
}

interface NewsletterStatsProps {
  newsletters: NewsletterItem[];
  className?: string;
}

export default function NewsletterStats({ newsletters, className = '' }: NewsletterStatsProps) {
  const stats = useMemo(() => {
    if (newsletters.length === 0) {
      return {
        totalIssues: 0,
        uniqueTags: 0,
        avgReadTime: '0 min',
        publishingFrequency: 'N/A',
        mostUsedTag: 'N/A',
        latestIssue: null,
        yearsActive: 0
      };
    }

    // Sort newsletters by date (newest first)
    const sortedNewsletters = [...newsletters].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate unique tags
    const allTags = newsletters.flatMap(n => n.tags);
    const uniqueTags = [...new Set(allTags)];
    
    // Find most used tag
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostUsedTag = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    // Calculate average read time
    const readTimes = newsletters
      .map(n => parseInt(n.readTime.match(/\d+/)?.[0] || '0'))
      .filter(time => !isNaN(time));
    
    const avgReadTime = readTimes.length > 0 
      ? `${Math.round(readTimes.reduce((a, b) => a + b, 0) / readTimes.length)} min`
      : '0 min';

    // Calculate years active
    const dates = newsletters.map(n => new Date(n.date));
    const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const newestDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const yearsActive = Math.max(1, Math.ceil((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 365)));

    // Calculate publishing frequency (issues per month)
    const monthsDiff = Math.max(1, Math.ceil((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const issuesPerMonth = newsletters.length / monthsDiff;
    
    let frequency = 'Irregular';
    if (issuesPerMonth >= 4) frequency = 'Weekly';
    else if (issuesPerMonth >= 2) frequency = 'Bi-weekly';
    else if (issuesPerMonth >= 1) frequency = 'Monthly';
    else if (issuesPerMonth >= 0.5) frequency = 'Bi-monthly';

    return {
      totalIssues: newsletters.length,
      uniqueTags: uniqueTags.length,
      avgReadTime,
      publishingFrequency: frequency,
      mostUsedTag,
      latestIssue: sortedNewsletters[0],
      yearsActive
    };
  }, [newsletters]);

  const statItems = [
    {
      icon: FileText,
      label: 'Total Issues',
      value: stats.totalIssues.toString(),
      color: 'var(--color-info)',
      bgColor: 'var(--color-info-bg)',
    },
    {
      icon: Calendar,
      label: 'Publishing',
      value: stats.publishingFrequency,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-bg)',
    },
    {
      icon: Clock,
      label: 'Avg. Read Time',
      value: stats.avgReadTime,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-bg)',
    },
    {
      icon: Tag,
      label: 'Topics Covered',
      value: stats.uniqueTags.toString(),
      color: 'var(--color-accent)',
      bgColor: 'var(--color-accent)/10',
    },
    {
      icon: TrendingUp,
      label: 'Years Active',
      value: stats.yearsActive.toString(),
      color: 'var(--color-info)',
      bgColor: 'var(--color-info-bg)',
    },
    {
      icon: BarChart3,
      label: 'Top Topic',
      value: stats.mostUsedTag,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-bg)',
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {statItems.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <div
            key={index}
            className="card hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="flex items-center p-6">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ 
                  backgroundColor: item.bgColor,
                  color: item.color 
                }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="ml-4 flex-1">
                <p 
                  className="text-2xl font-bold transition-colors"
                  style={{ color: 'var(--color-primary-text)' }}
                >
                  {item.value}
                </p>
                <p 
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-secondary-text)' }}
                >
                  {item.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}