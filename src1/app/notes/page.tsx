import React from 'react';
import Link from 'next/link';
import { organizeNotesTree } from '@/utils/notes-mdx';

export const metadata = {
  title: 'Notes | Documentation',
  description: 'Browse all documentation topics',
};

export default function NotesIndexPage() {
  const tree = organizeNotesTree();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Documentation</h1>
      <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
        Welcome to the documentation section. Browse topics below or use the navigation menu.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tree.map((node) => (
          <div key={node.path} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">
              <Link href={node.path} className="text-blue-600 dark:text-blue-400 hover:underline">
                {node.title}
              </Link>
            </h2>
            {node.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{node.description}</p>
            )}
            {node.children.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Topics:</p>
                <ul className="space-y-1">
                  {node.children.slice(0, 3).map((child) => (
                    <li key={child.path} className="text-sm">
                      <Link href={child.path} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {child.title}
                      </Link>
                    </li>
                  ))}
                  {node.children.length > 3 && (
                    <li className="text-sm">
                      <Link href={node.path} className="text-gray-500 dark:text-gray-400 hover:underline">
                        +{node.children.length - 3} more...
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}