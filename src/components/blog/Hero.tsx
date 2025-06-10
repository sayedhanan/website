import React from 'react';
import { CategoryNav } from './CategoryNav';

export function BlogHero() {
  return (
    <section className="relative bg-[--color-accent] pb-12">
      <div className="section-wrapper section-spacing text-center text-on-accent">
        <h1 className="text-5xl font-bold">
          Blog
        </h1>
        <p className="mt-2 text-lg text-on-accent-secondary">
          Explore articles, tutorials, and insights.
        </p>
      </div>

      {/* Integrated category nav overlapping bottom of hero */}
      <div className="absolute inset-x-0 bottom-0 translate-y-1/2">
        <div className="bg-[--color-accent]">
          <div className="section-wrapper py-4">
            <CategoryNav categories={[]} />
          </div>
        </div>
      </div>
    </section>
  );
}