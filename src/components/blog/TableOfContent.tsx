"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  isMobile: boolean;
}

export default function TableOfContents({ items, isMobile }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  // Listen for hash changes and scroll spy updates
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveId(hash);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Custom scroll spy effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          const newActiveId = visibleEntries[0].target.getAttribute("id");
          if (newActiveId && newActiveId !== activeId) {
            setActiveId(newActiveId);
            const newUrl = `${window.location.pathname}#${newActiveId}`;
            window.history.replaceState(null, "", newUrl);
          }
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0.1,
      }
    );

    const timeoutId = setTimeout(() => {
      document
        .querySelectorAll("article h2[id], article h3[id], article h4[id]")
        .forEach((heading) => observer.observe(heading));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [activeId]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    const target = document.getElementById(id);
    if (target) {
      const offset = isMobile ? 100 : 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);

      // On mobile, collapse TOC after clicking
      if (isMobile) {
        setIsExpanded(false);
      }
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  // Mobile/Tablet version (collapsible)
  if (isMobile) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-[var(--color-border)] overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center space-x-2">
            <List className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="font-semibold text-sm sm:text-base">Table of Contents</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[var(--color-secondary-text)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--color-secondary-text)]" />
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-[var(--color-border)] bg-white dark:bg-gray-900">
            <nav className="p-4">
              <ul className="text-sm space-y-1">
                {items.map((item, index) => {
                  const isActive = activeId === item.id;
                  return (
                    <li
                      key={`${item.id}-${index}`}
                      className={
                        `transition-all duration-200 ease-in-out
                        ${item.level === 2 ? "font-medium" : "font-normal"}
                        ${item.level === 3 ? "pl-4" : ""}
                        ${item.level === 4 ? "pl-8" : ""}
                        ${item.level >= 5 ? "pl-12" : ""}`
                      }
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleClick(e, item.id)}
                        className={
                          `block py-2 px-3 rounded-md transition-colors
                          ${isActive 
                            ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10 border-l-2 border-[var(--color-accent)]" 
                            : "text-[var(--color-secondary-text)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"}`
                        }
                        aria-current={isActive ? "location" : undefined}
                      >
                        {item.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        )}
      </div>
    );
  }

  // Desktop version (always visible, sticky)
  return (
    <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-2">
      <h4 className="text-sm font-semibold mb-3 pb-1 border-b border-[var(--color-border)]">
        Contents
      </h4>
      <nav>
        <ul className="text-sm space-y-1">
          {items.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={`${item.id}-${index}`}
                className={
                  `transition-all duration-200 ease-in-out
                  ${item.level === 2 ? "font-medium" : "font-normal"}
                  ${item.level === 3 ? "pl-3" : ""}
                  ${item.level === 4 ? "pl-6" : ""}
                  ${item.level >= 5 ? "pl-9" : ""}
                  border-l-2 transition-colors
                  ${isActive 
                    ? "border-[var(--color-accent)] text-[var(--color-accent)]" 
                    : "border-transparent hover:border-[var(--color-accent)]/50"}`
                }
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={
                    `block py-1 px-2 rounded-md transition-colors
                    ${isActive 
                      ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10" 
                      : "text-[var(--color-secondary-text)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"}`
                  }
                  aria-current={isActive ? "location" : undefined}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
