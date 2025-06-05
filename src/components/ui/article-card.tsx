// src/components/ui/article-card.tsx
import Link from 'next/link';

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
  categories = []
}: ArticleCardProps) {
  return (
    <article className="card">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map(category => (
            <Link 
              key={category} 
              href={`/blog/category/${category.toLowerCase()}`}
              className="
                text-xs 
                font-medium 
                px-2 py-1 
                rounded-full 
                bg-gray-200 
                hover:bg-gray-300 
                dark:bg-gray-700 
                dark:hover:bg-gray-600 
                transition-colors
              "
            >
              {category}
            </Link>
          ))}
        </div>
      )}
      <h3 className="card-title">
        <Link href={href} className="hover:underline">
          {title}
        </Link>
      </h3>
      <p className="card-excerpt">{excerpt}</p>
      <div className="card-meta">
        <time dateTime={date}>{date}</time>
        <span>{readingTime}</span>
      </div>
    </article>
  );
}