// src/components/blog/ScrollSpy.tsx
"use client";

import { useEffect, useRef, useCallback } from "react";

export default function TocScrollSpy() {
  const activeIdRef = useRef<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateActiveHeading = useCallback((newActiveId: string | null) => {
    if (newActiveId !== activeIdRef.current) {
      activeIdRef.current = newActiveId;
      
      // Dispatch a custom event that the TableOfContents can listen to
      const event = new CustomEvent('toc-active-change', {
        detail: { activeId: newActiveId }
      });
      window.dispatchEvent(event);
    }
  }, []);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the intersection handling to avoid rapid updates
    timeoutRef.current = setTimeout(() => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          // Sort by distance from top of viewport
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

      let newActiveId: string | null = null;

      if (visibleEntries.length > 0) {
        // Get the heading that's closest to the top of the viewport
        const topEntry = visibleEntries[0];
        newActiveId = topEntry.target.getAttribute("id");
      } else {
        // If no headings are visible, find the last heading that's above the viewport
        const allHeadings = Array.from(
          document.querySelectorAll("article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id]")
        );
        
        for (let i = allHeadings.length - 1; i >= 0; i--) {
          const heading = allHeadings[i];
          const rect = heading.getBoundingClientRect();
          if (rect.top < 100) { // If heading is above viewport
            newActiveId = heading.getAttribute("id");
            break;
          }
        }
      }

      updateActiveHeading(newActiveId);
    }, 100);
  }, [updateActiveHeading]);

  useEffect(() => {
    // Clean up any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: "-10% 0px -70% 0px", // Adjust these values to fine-tune when headings become "active"
      threshold: [0, 0.1, 0.5, 1],
    });

    // Function to start observing headings
    const startObserving = () => {
      const headings = document.querySelectorAll(
        "article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id]"
      );
      
      if (headings.length > 0 && observerRef.current) {
        headings.forEach((heading) => {
          observerRef.current!.observe(heading);
        });
        
        // Set initial active heading based on current scroll position
        const scrollY = window.scrollY;
        const headingArray = Array.from(headings);
        
        for (let i = headingArray.length - 1; i >= 0; i--) {
          const heading = headingArray[i];
          const rect = heading.getBoundingClientRect();
          const absoluteTop = rect.top + scrollY;
          
          if (absoluteTop <= scrollY + 100) {
            updateActiveHeading(heading.getAttribute("id"));
            break;
          }
        }
      } else {
        // If no headings found, retry after a short delay
        setTimeout(startObserving, 500);
      }
    };

    // Start observing (with a small delay to ensure content is rendered)
    const initTimeout = setTimeout(startObserving, 100);

    // Handle URL hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        updateActiveHeading(hash);
      }
    };

    // Set initial hash if present
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      clearTimeout(initTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [handleIntersection, updateActiveHeading]);

  return null;
}