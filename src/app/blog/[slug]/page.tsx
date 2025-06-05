// src/app/blog/[slug]/page.tsx

import { getPostBySlug, getPostSlugs } from "@/utils/blog-mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import TocScrollSpy from "@/components/blog/ScrollSpy";
import TableOfContents from "@/components/blog/TableOfContent";

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let post;

  try {
    post = await getPostBySlug(slug);
    if (post.draft && process.env.NODE_ENV !== "development") {
      notFound();
    }
  } catch {
    notFound();
  }

  const {
    title,
    date,
    readingTime,
    abstract,
    content,
    categories,
    tags,
    toc, // This is [ { id, title, level }, ... ]
  } = post;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const shareUrl = `${baseUrl}/blog/${slug}`;

  return (
    <section className="section-wrapper section-spacing">
      {/** 1) Mount the scroll-spy hook (client) */}
      <TocScrollSpy />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/** ─── LEFT SIDEBAR: Table of Contents ───────────────────────────── */}
        <aside className="hidden lg:block lg:col-span-3 px-4 relative">
          <TableOfContents items={toc} />
        </aside>

        {/** ─── MAIN CONTENT (center) ──────────────────────────────────────── */}
        <article className="col-span-1 lg:col-span-6 mx-auto lg:mx-0 prose lg:prose-xl dark:prose-invert">
          {post.draft && (
            <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 p-4 mb-6 rounded-md">
              This post is a draft and is not visible to the public.
            </div>
          )}

          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 not-prose">
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
                    dark:border-[var(--color-accent)] dark:hover:bg-[var(--color-accent-hover)]
                    dark:hover:text-black
                    transition-colors
                  "
                >
                  {category}
                </Link>
              ))}
            </div>
          )}

          <h1 className="mt-0">{title}</h1>

          {/** ─── DATE & READING TIME WITH ICONS ───────────────────────── */}
          <div className="flex items-center text-sm text-[var(--color-secondary-text)] dark:text-[var(--color-secondary-text)] mb-4 space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <time dateTime={date}>{date}</time>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {abstract && <p className="lead mb-6">{abstract}</p>}

          <div className="mdx-content">{content}</div>

          {tags && tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-[var(--color-border)]">
              <h4 className="font-semibold mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2 not-prose">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag.toLowerCase()}`}
                    className="
                      text-sm font-medium
                      px-2 py-1
                      rounded-md
                      border border-[var(--color-accent)] text-[var(--color-accent)]
                      hover:bg-[var(--color-accent)] hover:text-white
                      dark:border-[var(--color-accent)] dark:hover:bg-[var(--color-accent-hover)]
                      dark:hover:text-black
                      transition-colors
                    "
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/** ─── RIGHT SIDEBAR: Social Shares (sticky) ───────────────── */}
        <aside className="hidden lg:block lg:col-span-3 relative">
          <div className="sticky top-4">
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-[var(--color-secondary-text)] dark:text-[var(--color-secondary-text)]" />
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareUrl
                )}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[var(--color-secondary-text)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[var(--color-secondary-text)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  shareUrl
                )}&title=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[var(--color-secondary-text)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
