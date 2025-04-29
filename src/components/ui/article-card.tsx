"use client";

import Link from "next/link";

export interface ArticleCardProps {
  href: string;
  title: string;
  excerpt: string;
  date: string;      
  readingTime: string;
}

export function ArticleCard({
  href,
  title,
  excerpt,
  date,
  readingTime,
}: ArticleCardProps) {
  return (
    <article className="card">
      <div>
        {/* Only the title text is linked now */}
        <h3 className="card-title">
          <Link href={href} className="hover:underline">
            {title}
          </Link>
        </h3>
        <p className="card-excerpt">{excerpt}</p>
      </div>
      <div className="card-meta">
        <time dateTime={date}>{date}</time>
        <span>{readingTime}</span>
      </div>
    </article>
  );
}
