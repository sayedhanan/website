"use client";

import Link from "next/link";

export interface ArticleCardProps {
  href: string;
  title: string;
  excerpt: string;
  date: string;      // e.g. "Mar 16, 2020"
  readingTime: string; // e.g. "5 min read"
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
        <h3 className="card-title">
          <Link href={href}>
            <span className="absolute inset-0" />
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
