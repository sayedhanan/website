// src/components/blog/TableOfContents.tsx
"use client";

import React from "react";

interface TocItem {
  id: string;
  title: string;
  level: number; // 2 = <h2>, 3 = <h3>
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-2">
      <h4 className="text-sm font-semibold mb-3 pb-1 border-b border-[var(--color-border)]">
        Contents
      </h4>
      <ul className="text-sm space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            // We start every <li> with data-active="false"
            data-active="false"
            className={`
              transition-all duration-200 ease-in-out
              ${item.level === 2 ? "font-medium" : "font-normal pl-3 text-[0.95em]"}
              border-l-2 border-transparent
              hover:border-[var(--color-accent)] hover:pl-3
              data-[active=true]:border-[var(--color-accent)]
              data-[active=true]:text-[var(--color-accent)]
              data-[active=true]:pl-3
            `}
          >
            <a
              href={`#${item.id}`}
              className="block py-0.5 text-[var(--color-secondary-text)] hover:text-[var(--color-accent)]"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(item.id);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                  // Push new #hash into URL without reloading
                  window.history.pushState(null, "", `#${item.id}`);
                }
              }}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
