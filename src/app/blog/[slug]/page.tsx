// src/app/blog/[slug]/page.tsx

import { getPostBySlug, getPostSlugs } from "@/utils/blog-mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Share2,
  Twitter,
  Linkedin,
} from "lucide-react";
import TocScrollSpy from "@/components/blog/ScrollSpy";
import TableOfContents from "@/components/blog/TableOfContent";
import SocialShare from "@/components/blog/SocialShare";

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
    toc,
  } = post;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const shareUrl = `${baseUrl}/blog/${slug}`;

  return (
    <section className="section-wrapper section-spacing">
      {/** Mount the scroll-spy hook (client) */}
      <TocScrollSpy />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/** ─── MOBILE/TABLET: Table of Contents at Top ─────────────────── */}
        <div className="block lg:hidden mb-8">
          <TableOfContents items={toc} isMobile={true} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/** ─── DESKTOP: Left Sidebar TOC ─────────────────────────────── */}
          <aside className="hidden lg:block lg:col-span-3 px-4 relative">
            <TableOfContents items={toc} isMobile={false} />
          </aside>

          {/** ─── MAIN CONTENT ──────────────────────────────────────────── */}
          <article className="col-span-1 lg:col-span-6 mx-auto lg:mx-0 prose prose-base sm:prose-lg lg:prose-xl dark:prose-invert max-w-none">
            
            {/** Draft Notice */}
            {post.draft && (
              <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 p-4 mb-6 rounded-md">
                This post is a draft and is not visible to the public.
              </div>
            )}

            {/** Categories */}
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 not-prose">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/blog/category/${category.toLowerCase()}`}
                    className="
                      text-xs sm:text-sm font-medium
                      px-2 py-1 sm:px-3 sm:py-1.5
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

            {/** Title */}
            <h1 className="mt-0 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {title}
            </h1>

            {/** Date & Reading Time */}
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-[var(--color-secondary-text)] dark:text-[var(--color-secondary-text)] mb-6 space-y-2 sm:space-y-0 sm:space-x-4 not-prose">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime={date}>{date}</time>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            {/** Abstract */}
            {abstract && (
              <p className="lead text-base sm:text-lg lg:text-xl text-[var(--color-secondary-text)] dark:text-[var(--color-secondary-text)] mb-8 font-medium leading-relaxed">
                {abstract}
              </p>
            )}

            {/** Mobile Social Share - Above Content */}
            <div className="block sm:hidden mb-6 not-prose">
              <SocialShare 
                shareUrl={shareUrl} 
                title={title} 
                isMobile={true} 
              />
            </div>

            {/** Main Content */}
            <div className="mdx-content">{content}</div>

            {/** Tags */}
            {tags && tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[var(--color-border)] not-prose">
                <h4 className="font-semibold mb-3 text-base sm:text-lg">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag.toLowerCase()}`}
                      className="
                        text-xs sm:text-sm font-medium
                        px-2 py-1 sm:px-3 sm:py-1.5
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

            {/** Mobile/Tablet Social Share - Below Content */}
            <div className="block lg:hidden mt-8 pt-6 border-t border-[var(--color-border)] not-prose">
              <SocialShare 
                shareUrl={shareUrl} 
                title={title} 
                isMobile={true} 
              />
            </div>
          </article>

          {/** ─── DESKTOP: Right Sidebar Social Share ─────────────────── */}
          <aside className="hidden lg:block lg:col-span-3 relative">
            <SocialShare 
              shareUrl={shareUrl} 
              title={title} 
              isMobile={false} 
            />
          </aside>
        </div>
      </div>
    </section>
  );
}