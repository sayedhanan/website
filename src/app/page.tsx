// src/app/page.tsx
import Hero from "@/components/home/Hero";
import RecentPostsSection from "@/components/home/RecenPostSection";


export default function Notes() {
  return (
    <>
      <section className="section-wrapper section-spacing" aria-label="Homepage hero">
        <Hero />
      </section>

      <section className="section-wrapper section-spacing" aria-label="Homepage hero">
        {/* <Recent Posts /> */}
        <RecentPostsSection />
      </section>

      {/* Future Sections */}
      <section className="py-12 md:py-16 lg:py-20">{/* <Features /> */}</section>
      <section className="py-12 md:py-16 lg:py-20">{/* <Testimonials /> */}</section>
    </>
  );
}
