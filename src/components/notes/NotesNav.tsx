// src/components/notes/NotesNav.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NoteNode } from '@/utils/notes-mdx';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface NotesNavProps {
  tree: NoteNode[];
  className?: string;
}

export function NotesNav({ tree, className = '' }: NotesNavProps) {
  const pathname = usePathname();

  return (
    <div className={`${className} w-full flex flex-col`}>
      <h4 className="text-sm font-semibold mb-3 pb-1 border-b border-[var(--color-border)]">
        Documentation
      </h4>
      <div className="space-y-1">
        <NavTree nodes={tree} pathname={pathname} level={0} />
      </div>
    </div>
  );
}

interface NavTreeProps {
  nodes: NoteNode[];
  pathname: string;
  level: number;
}

function NavTree({ nodes, pathname, level }: NavTreeProps) {
  return (
    <ul className={`space-y-1 ${level > 0 ? 'ml-3' : ''}`}>
      {nodes.map((node) => (
        <NavItem key={node.path} node={node} pathname={pathname} level={level} />
      ))}
    </ul>
  );
}

interface NavItemProps {
  node: NoteNode;
  pathname: string;
  level: number;
}

function NavItem({ node, pathname, level }: NavItemProps) {
  const isActive = pathname === node.path;
  const isChildActive = pathname.startsWith(`${node.path}/`);
  const isAncestorActive = pathname.startsWith(node.path) && !isActive;

  // Initialize expanded state based on active or descendant status
  const [isExpanded, setIsExpanded] = useState(isActive || isChildActive);

  // Expand whenever this node or a child becomes active
  useEffect(() => {
    if (isActive || isChildActive) {
      setIsExpanded(true);
    }
  }, [isActive, isChildActive]);

  const hasChildren = node.children.length > 0;

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <li>
      <div className="flex items-center">
        {hasChildren && (
          <button
            onClick={toggleExpand}
            className={`mr-1 p-1 rounded-sm hover:bg-[var(--color-accent)]/5 transition-colors focus:outline-none ${
              isAncestorActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-secondary-text)]'
            }`}
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}

        {!hasChildren && <div className="w-6" />}

        <div
          className={`
            flex-grow transition-all duration-200 ease-in-out
            ${level === 2 ? "font-medium" : "font-normal"}
            ${level === 3 ? "pl-3" : ""}
            ${level === 4 ? "pl-6" : ""}
            ${level >= 5 ? "pl-9" : ""}
            border-l-2 transition-colors
            ${isActive 
              ? "border-[var(--color-accent)] text-[var(--color-accent)]" 
              : "border-transparent hover:border-[var(--color-accent)]/50"
            }
          `}
        >
          <Link
            href={node.path}
            className={`
              block py-1 px-2 text-sm rounded-md transition-colors
              ${isActive
                ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10'
                : isAncestorActive
                ? 'text-[var(--color-accent)] font-medium'
                : 'text-[var(--color-secondary-text)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5'
              }
            `}
            aria-current={isActive ? "location" : undefined}
          >
            {node.title}
          </Link>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <NavTree nodes={node.children} pathname={pathname} level={level + 1} />
      )}
    </li>
  );
}