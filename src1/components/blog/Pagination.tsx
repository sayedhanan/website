// src/components/blog/Pagination.tsx
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  categoryPath?: string;
  tagPath?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  basePath = "/blog", 
  categoryPath, 
  tagPath 
}: PaginationProps) {
  const path = categoryPath 
    ? `/blog/category/${categoryPath}` 
    : tagPath 
      ? `/blog/tag/${tagPath}` 
      : basePath;

  // Show at most 5 pages with ellipsis
  let pagesToShow: (number | string)[] = [];
  
  if (totalPages <= 5) {
    // If we have 5 or fewer pages, show all
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    // Always include first and last page
    if (currentPage <= 3) {
      // Near the start
      pagesToShow = [1, 2, 3, 4, '...', totalPages];
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pagesToShow = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      // Somewhere in the middle
      pagesToShow = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  }

  return (
    <nav className="mt-8 flex justify-center space-x-2">
      {currentPage > 1 && (
        <Link 
          href={`${path}?page=${currentPage - 1}`} 
          className="btn btn-outline"
          aria-label="Previous page"
        >
          Prev
        </Link>
      )}
      
      {pagesToShow.map((page, i) => (
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="btn btn-disabled">...</span>
        ) : (
          <Link
            key={page}
            href={`${path}?page=${page}`}
            className={`btn ${page === currentPage ? "btn-primary" : "btn-secondary"}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      ))}
      
      {currentPage < totalPages && (
        <Link 
          href={`${path}?page=${currentPage + 1}`} 
          className="btn btn-outline"
          aria-label="Next page"
        >
          Next
        </Link>
      )}
    </nav>
  );
}