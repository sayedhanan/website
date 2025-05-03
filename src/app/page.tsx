// src/app/page.tsx
import Hero from "@/components/home/Hero";
import RecentPostsSection from "@/components/home/RecenPostSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import FeaturedNotes from "@/components/notes/FeaturedNotes";
import { getFeaturedNotes } from "@/utils/featured-notes";

export default function Home() {
  // Get featured notes for the carousel
  const featuredNotes = getFeaturedNotes(6);

  return (
    <>
      <section className="section-wrapper section-spacing" aria-label="Homepage hero">
        <Hero />
      </section>

      <section className="section-wrapper section-spacing" aria-label="Recent blog posts">
        <RecentPostsSection />
      </section>

      <section className="section-wrapper section-spacing" aria-label="Featured documentation">
        <FeaturedNotes 
          notes={featuredNotes}
          title="Featured Documentation" 
          description="Explore our most helpful guides and resources"
        />
      </section>

      <section className="section-wrapper section-spacing" aria-label="Newsletter signup">
        <NewsletterSection />
      </section>

      {/* Future Sections */}
      {/* <section className="py-12 md:py-16 lg:py-20"><Features /></section> */}
      {/* <section className="py-12 md:py-16 lg:py-20"><Testimonials /></section> */}
    </>
  );
}