import React from 'react';
import { Calendar, ExternalLink, Clock } from 'lucide-react';

// Define the shape of a newsletter item
export interface Newsletter {
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  substackUrl: string;
}

// Props for the NewsletterCard component
interface NewsletterCardProps {
  newsletter: Newsletter;
  showTimeline?: boolean;
}

const NewsletterCard: React.FC<NewsletterCardProps> = ({ newsletter, showTimeline = true }) => {
  // Format a date string into a more readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="card group hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Timeline indicator */}
        {showTimeline && (
          <div className="flex items-center md:flex-col md:items-center gap-2 md:gap-1 flex-shrink-0">
            <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full flex-shrink-0"></div>
            <div className="hidden md:block w-px bg-[var(--color-border)] h-16 mt-2"></div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
            <h2 className="card-title group-hover:text-[var(--color-accent)] transition-colors duration-200">
              {newsletter.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[var(--color-secondary-text)] flex-shrink-0">
              <Calendar className="w-3 h-3" />
              {formatDate(newsletter.date)}
            </div>
          </div>

          <p className="card-excerpt mb-4">{newsletter.excerpt}</p>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-[var(--color-secondary-text)]">
                <Clock className="w-3 h-3" />
                {newsletter.readTime}
              </div>
              <div className="flex gap-2">
                {newsletter.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-[var(--color-background)] text-[var(--color-secondary-text)] text-xs rounded border border-[var(--color-border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={newsletter.substackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm flex items-center gap-2 hover:gap-3 transition-all duration-200"
            >
              Read on Substack
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsletterCard;
