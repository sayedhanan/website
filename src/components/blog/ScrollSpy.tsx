// src/components/blog/ScrollSpy.tsx
"use client";

import { useEffect, useRef } from "react";

export default function TocScrollSpy() {
  // We keep track of the currently "active" heading ID
  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Sort entries so that the one nearest the top of viewport is first.
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        let newActiveId: string | null = null;
        if (visibleEntries.length > 0) {
          // The heading closest to the top of the viewport
          newActiveId = visibleEntries[0].target.getAttribute("id");
        }

        // If the active ID changed, update data-active attributes:
        if (newActiveId !== activeIdRef.current) {
          // Clear old active
          if (activeIdRef.current) {
            const oldLink = document.querySelector<HTMLAnchorElement>(
              `li a[href="#${activeIdRef.current}"]`
            )?.parentElement;
            if (oldLink) {
              oldLink.dataset.active = "false";
            }
          }
          // Set new active
          if (newActiveId) {
            const newLink = document.querySelector<HTMLAnchorElement>(
              `li a[href="#${newActiveId}"]`
            )?.parentElement;
            if (newLink) {
              newLink.dataset.active = "true";
            }
          }
          activeIdRef.current = newActiveId;
        }
      },
      {
        rootMargin: "0px 0px -70% 0px", // Fire when heading is 70% below top
        threshold: 0.1,
      }
    );

    // Observe all <h2> and <h3> inside the <article>
    document
      .querySelectorAll("article h2[id], article h3[id]")
      .forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  return null;
}
