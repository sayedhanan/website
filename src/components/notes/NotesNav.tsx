// src/components/NotesNav.tsx
'use client';

import React, { useState } from 'react';
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
      {/* Heading “Documentation” in primary text color */}
      <h3 className="font-semibold text-lg mb-4 text-[var(--color-primary-text)]">
        Documentation
      </h3>
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
  const isChildActive = !isActive && pathname.startsWith(node.path);

  // Automatically expand if this item or any child is active
  const [isExpanded, setIsExpanded] = useState(isActive || isChildActive);

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
            className="
              mr-1 p-1 rounded-sm
              hover:bg-[var(--color-border)]
              transition-colors
              focus:outline-none
            "
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-[var(--color-primary-text)]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-[var(--color-primary-text)]" />
            )}
          </button>
        )}

        {!hasChildren && <div className="w-6" />}

        <Link
          href={node.path}
          className={`flex-grow py-1 px-2 text-sm rounded transition-colors ${
            isActive
              ? 'bg-[var(--color-info-bg)] text-[var(--color-info)] font-medium'
              : 'text-[var(--color-secondary-text)] hover:bg-[var(--color-border)]'
          }`}
        >
          {node.title}
        </Link>
      </div>

      {hasChildren && isExpanded && (
        <NavTree nodes={node.children} pathname={pathname} level={level + 1} />
      )}
    </li>
  );
}
