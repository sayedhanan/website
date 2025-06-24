// File: src/components/blog/Pagination.tsx

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  maxVisiblePages?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  basePath,
  maxVisiblePages = 5,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - halfVisible);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  const getPageUrl = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`;

  const handleClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
    // navigation via <Link> will still happen
  };

  return (
    <nav className="flex items-center justify-center space-x-2 mt-8" aria-label="Pagination Navigation">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          onClick={() => handleClick(currentPage - 1)}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:border-blue-500 transition-all duration-200"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Link>
      ) : (
        <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </span>
      )}

      {/* First page + ellipsis */}
      {visiblePages[0] > 1 && (
        <>
          <Link
            href={getPageUrl(1)}
            onClick={() => handleClick(1)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:border-blue-500 transition-all duration-200 min-w-[40px] text-center"
            aria-label="Go to page 1"
          >
            1
          </Link>
          {visiblePages[0] > 2 && <span className="px-2 py-2 text-gray-500 dark:text-gray-400">…</span>}
        </>
      )}

      {/* Page numbers */}
      {visiblePages.map((page) =>
        page === currentPage ? (
          <span
            key={page}
            className="px-3 py-2 text-sm font-medium bg-blue-600 text-white border border-blue-600 rounded-lg shadow-md cursor-default min-w-[40px] text-center font-semibold"
            aria-label={`Current page ${page}`}
            aria-current="page"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            onClick={() => handleClick(page)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:border-blue-500 transition-all duration-200 min-w-[40px] text-center"
            aria-label={`Go to page ${page}`}
          >
            {page}
          </Link>
        )
      )}

      {/* Last page + ellipsis */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 py-2 text-gray-500 dark:text-gray-400">…</span>
          )}
          <Link
            href={getPageUrl(totalPages)}
            onClick={() => handleClick(totalPages)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:border-blue-500 transition-all duration-200 min-w-[40px] text-center"
            aria-label={`Go to page ${totalPages}`}
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          onClick={() => handleClick(currentPage + 1)}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:border-blue-500 transition-all duration-200"
          aria-label="Go to next page"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      ) : (
        <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500">
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </span>
      )}
    </nav>
  );
};

export default Pagination;
