// src/app/blog/[slug]/page.tsx
import { getPostBySlug, getPostSlugs } from '@/utils/blog-mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  let post;
  try {
    post = await getPostBySlug(slug);
    
    // If the post is a draft and we're not in development mode, show 404
    if (post.draft && process.env.NODE_ENV !== 'development') {
      notFound();
    }
  } catch {
    notFound();
  }

  const { title, date, readingTime, abstract, content, categories, tags } = post;

  return (
    <section className="section-wrapper section-spacing">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 justify-items-center lg:justify-items-start">
        {/* Left aside (hidden on small, 25% on lg) */}
        <aside className="hidden lg:block lg:col-span-3">
          {/* TODO: insert TableOfContents here */}
        </aside>

        {/* Main article (centered on small) */}
        <article className="col-span-1 lg:col-span-6 mx-auto lg:mx-0 prose lg:prose-xl dark:prose-invert">
          {post.draft && (
            <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 p-4 mb-6 rounded-md">
              This post is a draft and is not visible to the public.
            </div>
          )}
          
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 not-prose">
              {categories.map(category => (
                <Link 
                  key={category} 
                  href={`/blog/category/${category.toLowerCase()}`}
                  className="
                    text-sm
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
          
          <h1 className="mt-0">{title}</h1>
          <time className="block text-sm text-secondary mb-4" dateTime={date}>
            {date} &middot; {readingTime} min read
          </time>
          {abstract && <p className="lead mb-6">{abstract}</p>}
          <div className="mdx-content">{content}</div>
          
          {tags && tags.length > 0 && (
            <div className="mt-8 pt-4 border-t">
              <h4>Tags:</h4>
              <div className="flex flex-wrap gap-2 not-prose">
                {tags.map(tag => (
                  <Link 
                    key={tag} 
                    href={`/blog/tag/${tag.toLowerCase()}`}
                    className="
                      text-sm
                      font-medium 
                      px-2 py-1 
                      rounded-full 
                      bg-gray-100 
                      hover:bg-gray-200 
                      dark:bg-gray-800 
                      dark:hover:bg-gray-700 
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

        {/* Right aside (hidden on small, 25% on lg) */}
        <aside className="hidden lg:block lg:col-span-3">
          {/* TODO: insert RelatedPosts or other component here */}
        </aside>
      </div>
    </section>
  );
}