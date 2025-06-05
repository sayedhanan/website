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
      <h3 className="font-semibold text-lg mb-4">Documentation</h3>
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
      {nodes.map(node => (
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
            className="mr-1 p-1 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        
        {!hasChildren && <div className="w-6"></div>}
        
        <Link
          href={node.path}
          className={`flex-grow py-1 px-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            isActive 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium' 
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {node.title}
        </Link>
      </div>
      
      {hasChildren && isExpanded && (
        <NavTree 
          nodes={node.children} 
          pathname={pathname} 
          level={level + 1} 
        />
      )}
    </li>
  );
}