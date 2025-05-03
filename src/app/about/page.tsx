import type { Metadata } from "next";
import Hero from "@/components/about/Hero";


export const metadata: Metadata = {
  title: "About  – Sayed Hanan",
  description: "The principles and ideas that guide how I learn, work, and live.",
};

export default function PhilosophyPage() {
  return (
    <section className="section-wrapper section-spacing" aria-label="About hero">
      <Hero />
    </section>
  );
}
