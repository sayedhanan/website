// src/components/ui/article-card.tsx
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

export interface ArticleCardProps {
  href: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  categories?: string[];
}

export default function ArticleCard({
  href,
  title,
  excerpt,
  date,
  readingTime,
  categories = [],
}: ArticleCardProps) {
  return (
    <article className="card bg-[var(--color-surface)] dark:bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 hover:shadow-lg transition-shadow">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/blog/category/${category.toLowerCase()}`}
              className="
                text-xs font-medium
                px-2 py-1
                rounded-md
                border border-[var(--color-accent)] text-[var(--color-accent)]
                hover:bg-[var(--color-accent)] hover:text-white
                dark:border-[var(--color-accent)] dark:text-[var(--color-accent)]
                dark:hover:bg-[var(--color-accent-hover)] dark:hover:text-black
                transition-colors
              "
            >
              {category}
            </Link>
          ))}
        </div>
      )}

      <h3 className="card-title text-lg font-semibold mb-2">
        <Link href={href} className="hover:underline">
          {title}
        </Link>
      </h3>

      <p className="card-excerpt text-sm text-[var(--color-secondary-text)] dark:text-[var(--color-secondary-text)] mb-4">
        {excerpt}
      </p>

      <div className="card-meta flex items-center text-xs text-[var(--color-secondary-text)] dark:text-[var(--color-secondary-text)] space-x-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <time dateTime={date}>{date}</time>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{readingTime}</span>
        </div>
      </div>
    </article>
  );
}
