// File: app/blog/tag/[tag]/page.tsx
import { getAllTags, getPostsByTag, getAllCategories } from '@/utils/blog-mdx';
import { CategoryNav } from '@/components/blog/CategoryNav';
import LoadMoreButton from '@/components/blog/LoadMoreButton';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: tag.toLowerCase(),
  }));
}

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  const allTags = await getAllTags();
  const exactTag = allTags.find(
    (t) => t.toLowerCase() === decodedTag.toLowerCase()
  );
  
  if (!exactTag) {
    notFound();
  }
  
  const posts = await getPostsByTag(exactTag);
  const categories = await getAllCategories();
  
  return (
    <section className="section-wrapper section-spacing">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tag: #{exactTag}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} with this tag
        </p>
      </div>
      
      <CategoryNav categories={categories} />
      
      <LoadMoreButton 
        posts={posts}
        showPostCount={true}
      />
    </section>
  );
}